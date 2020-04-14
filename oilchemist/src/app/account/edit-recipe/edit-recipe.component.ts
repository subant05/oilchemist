import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../../recipes/recipe.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../auth/auth.service'
import {take, tap} from 'rxjs/operators'
import { Recipe } from 'src/app/recipes/recipe.model';


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

  onSubmit(event) {

    this.authService.user.pipe(take(1)).subscribe(user=>{
      const file = event.target.elements["imageUrl"].files[0];
      const filePath = `image/blends/${new Date().valueOf().toString()}_${file.name}`;
      const task = this.storage.upload(filePath, file);
     
      const percentageChanges = task.percentageChanges().pipe(tap(data=>{
        // console.log("percentage: ", data)
      }));

      const snapshotChanges = task.snapshotChanges().pipe(tap(data=>{
        // console.log("snapshot: ", data)
      }));

      percentageChanges.subscribe(data=>{
        // console.log("subscription: percentage: ", data)
      })

      snapshotChanges.subscribe(data=>{
        // console.log("subscription: snapshotChanges: ", data)
      })

      task.then(data=>data.ref.getDownloadURL().then((downloadURL)=>{
        const formData = this.recipeForm.value
        formData.name = formData.name.toLowerCase()
        formData.description = formData.description.toLowerCase()
        formData.imageUrl = downloadURL
        formData.creator = user.id
        if (this.editMode) {

        } else{
          this.recipeService.addRecipe(formData).then(success=>{
            this.onCancel();
          });
        }
      }))
    })
  }

  onCancel() {
    this.router.navigate(['../my-blends'], { relativeTo: this.route });
  }
  
  onFileChange(event){
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
          recipeOilsUsed.push(
            new FormGroup({
              name: new FormControl(oil.name, Validators.required),
              brand: new FormControl(oil.brand, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
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
      imageUrl: new FormControl(recipeImage, [Validators.required]),
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
