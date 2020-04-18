import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../../recipes/recipe.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../auth/auth.service'
import { take } from 'rxjs/operators'
import { Recipe } from 'src/app/recipes/recipe.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.less']
})
export class EditRecipeComponent implements OnInit, OnDestroy {
  private routeParamsSubscription: Subscription
  private userSubscription: Subscription

  id: string;
  editMode = false;
  recipe: Recipe;
  recipeForm: FormGroup;
  fileFormLabel = 'Images Only'
  showForm: boolean = false
  isSubmiting:boolean = false;
  oilBrands:{label:string, value:string}[] = []
  recipeCategories:string[] = []

  constructor( private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage) {
      this.recipeCategories = this.recipeService.categories;
      this.oilBrands = this.recipeService.brands;
     }
  
  get oils(){
    return (<FormArray>this.recipeForm.get('oils')).controls
  }
  
  get categories(){
    return (<FormArray>this.recipeForm.get('categories')).controls
  }

  private getUsesFromForm(form){
    return ['Topical','Aromatic','Internal'].map(item=>{
      const tmpObj = {}
      tmpObj[item] = form.elements[item].checked
      return tmpObj
    })
  }

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      if(this.editMode ) {
        this.recipeService.getRecipe(params['id']).subscribe(data=>{
          this.recipe = data
          this.initForm();
        });
      } else{
        this.initForm();
      }
    });
  }

  ngOnDestroy(){
    if(this.routeParamsSubscription)
      this.routeParamsSubscription.unsubscribe()
    if(this.userSubscription )
      this.userSubscription.unsubscribe()
  }

  onAddOil() {
    (<FormArray>this.recipeForm.get('oils')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        brand: new FormControl('doterra', [Validators.required]),
        drops: new FormControl( 1, [Validators.required, Validators.pattern(/[0-9]+/), Validators.min(1)])
      })
    );
  }

  onAddCategory() {
    (<FormArray>this.recipeForm.get('categories')).push(
      new FormControl('health', [Validators.required])
    );
  }

  onDeleteOil(index: number) {
    (<FormArray>this.recipeForm.get('oils')).removeAt(index);
  }

  onDeleteCategory(index: number) {
    (<FormArray>this.recipeForm.get('categories')).removeAt(index);
  }

  private formatFormData(creator:string, imageUrl: string){
    const formData = this.recipeForm.value
    formData.name = formData.name
    formData.description = formData.description
    formData.searchableName =  formData.name.toLowerCase()
    formData.searchableDescription = formData.name.toLowerCase()
    formData.imageUrl = imageUrl
    formData.modified = new Date().toUTCString()
    formData.creator = creator
    if(!this.editMode)
      formData.created = formData.modified  

    return formData
  }

  onBrandChange(event: any){
      if(event.target.value === "other"){
        event.target.nextElementSibling.value = ""
        event.target.nextElementSibling.type = "text"
        event.target.parentNode.removeChild(event.target)
        
      }
  }

  onCategoryChange(event: any){
    if(event.target.value === "other"){
      event.target.nextElementSibling.value = ""
      event.target.nextElementSibling.type = "text"
      event.target.parentNode.removeChild(event.target)
      
    }
}

  onSubmit(event) {
    this.isSubmiting = true
    if(!this.recipeForm.valid){
      this.isSubmiting = false
      return
    }

    if(this.editMode && this.recipe.imageUrl){
      const formData = this.formatFormData(this.recipe.creator, this.recipe.imageUrl)

      this.recipeService.updateRecipe(this.id, formData).then(()=>{
        this.onCancel()
      })

    } else {
      this.userSubscription = this.authService.user.pipe(take(1)).subscribe(user=>{
        if(event.target.elements["imageUrl"].files.length){
          const file = event.target.elements["imageUrl"].files[0];
          const filePath = `image/blends/${Math.random().toFixed(3).toString()}_${new Date(new Date().toUTCString()).valueOf().toString()}_${file.name}`;
          const task = this.storage.upload(filePath, file);
          task.then(data=>data.ref.getDownloadURL().then((downloadURL)=>{
            const formData = this.formatFormData(user.id, downloadURL)
  
            if (this.editMode) {
              this.recipeService.updateRecipe(this.id, formData).then(()=>{
                this.onCancel()
              })
            } else{
              this.recipeService.addRecipe(formData).then(success=>{
                this.onCancel();
              });
            }
  
          }))
        } else {
          const formData = this.formatFormData(user.id, null)
  
          if (this.editMode) {
            this.recipeService.updateRecipe(this.id, formData).then(()=>{
              this.onCancel()
            })
          } else{
            this.recipeService.addRecipe(formData).then(success=>{
              this.onCancel();
            });
          }

        }
      })
    } 

  }

  onCancel() {
    this.router.navigate(['/account/my-blends'], { relativeTo: this.route });
  }
  
  onFileChange(event){
    if(this.recipe && this.recipe.imageUrl)
      this.recipe.imageUrl = null;
    this.fileFormLabel = event.target.files[0].name
  }

  private initForm() {
    let recipeName = '';
    let recipeImage = '';
    let recipeDescription = '';
    let recipesApplications = {
      topical:false,
      aromatic:false,
      internal:false
    }
    let recipeOilsUsed = new FormArray([],[Validators.required]);
    let recipeCategoriesForm = new FormArray([], Validators.required)

    if (this.editMode && this.recipe) {
      recipeName = this.recipe.name;
      recipeDescription = this.recipe.description;
      // Oils
      if (this.recipe['oils']) {
        for (let oil of this.recipe.oils) {
          if(!this.oilBrands.find(item=>{
            return oil.brand === item.value || oil.brand === item.label
          })){
            this.oilBrands.push({value:oil.brand, label:oil.brand})
          }

          recipeOilsUsed.push(
            new FormGroup({
              name: new FormControl(oil.name, [Validators.required]),
              brand: new FormControl(oil.brand, [Validators.required]),
              drops: new FormControl(oil.drops ? oil.drops : 1, [Validators.required, Validators.pattern(/[0-9]+/), Validators.min(1)])
            })
          );
        }
      }
      // Categories
      if (this.recipe['categories']) {
        this.recipe.categories.forEach(category=>{
          recipeCategoriesForm.push(
            new FormControl(category, [Validators.required])
          );
        })

      }
      recipesApplications = {
        topical:this.recipe.uses.topical,
        aromatic:this.recipe.uses.aromatic,
        internal:this.recipe.uses.internal
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, [Validators.required]),
      description: new FormControl(recipeDescription, []),
      imageUrl: new FormControl(recipeImage, []),
      uses: new FormGroup({
        topical: new FormControl(recipesApplications.topical, [Validators.required]),
        aromatic: new FormControl(recipesApplications.aromatic, [Validators.required]),
        internal: new FormControl(recipesApplications.internal)
      },[Validators.required]),
          
      oils: recipeOilsUsed,
      categories: recipeCategoriesForm
    });

    this.showForm = true
  }
}
