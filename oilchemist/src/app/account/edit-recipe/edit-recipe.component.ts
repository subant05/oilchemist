import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../../recipes/recipe.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../auth/auth.service'
import {take, tap} from 'rxjs/operators'
import { Recipe } from 'src/app/recipes/recipe.model';
import { element } from 'protractor';


@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.less']
})
export class EditRecipeComponent implements OnInit {
  id: string;
  editMode = false;
  recipe: Recipe;
  recipeForm: FormGroup;
  fileFormLabel = 'Images Only'
  showForm: boolean = false
  oilBrands:{label:string, value:string}[] = [
    {value:"doterra", label:"Doterra"}
    , {value:"young living", label:"Young Living"}
  ]

  constructor( private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage) { }
  
  get oils(){
    return (<FormArray>this.recipeForm.get('oils')).controls
  }
  
  private getUsesFromForm(form){
    return ['Topical','Aromatic','Internal'].map(item=>{
      const tmpObj = {}
      tmpObj[item] = form.elements[item].checked
      return tmpObj
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
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

  onAddOil() {
    (<FormArray>this.recipeForm.get('oils')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        brand: new FormControl('doterra', [Validators.required])
      })
    );
  }

  onDeleteOil(index: number) {
    (<FormArray>this.recipeForm.get('oils')).removeAt(index);
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

  onSubmit(event) {

    if(this.editMode && this.recipe.imageUrl){
      const formData = this.formatFormData(this.recipe.creator, this.recipe.imageUrl)

      this.recipeService.updateRecipe(this.id, formData).then(()=>{
        this.onCancel()
      })

    } else {
      this.authService.user.pipe(take(1)).subscribe(user=>{
        const file = event.target.elements["imageUrl"].files[0];
        const filePath = `image/blends/${new Date().valueOf().toString()}_${file.name}`;
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

    if (this.editMode && this.recipe) {
      recipeName = this.recipe.name;
      recipeDescription = this.recipe.description;
      if (this.recipe['oils']) {
        for (let oil of this.recipe.oils) {
          debugger;
          if(!this.oilBrands.find(item=>{
            return oil.brand === item.value || oil.brand === item.label
          })){
            this.oilBrands.push({value:oil.brand, label:oil.brand})
          }

          recipeOilsUsed.push(
            new FormGroup({
              name: new FormControl(oil.name, [Validators.required]),
              brand: new FormControl(oil.brand, [Validators.required])
            })
          );
        }
      }
      recipesApplications = {
        topical:this.recipe.uses.topical,
        aromatic:this.recipe.uses.aromatic,
        internal:this.recipe.uses.internal
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, [Validators.required]),
      description: new FormControl(recipeDescription, [Validators.required]),
      imageUrl: new FormControl(recipeImage, []),
      uses: new FormGroup({
        topical: new FormControl(recipesApplications.topical, [Validators.required]),
        aromatic: new FormControl(recipesApplications.aromatic, [Validators.required]),
        internal: new FormControl(recipesApplications.internal)
      },[Validators.required]),
          
      oils: recipeOilsUsed
    });

    this.showForm = true
  }
}
