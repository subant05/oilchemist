import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../../recipes/recipe.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../auth/auth.service'
import {take, tap} from 'rxjs/operators'


@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.less']
})
export class EditRecipeComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor( private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }
  onSubmit(event) {

    this.authService.user.pipe(take(1)).subscribe(user=>{
      const file = event.target.elements["image"].files[0];
      const filePath = `image/blends/${new Date().valueOf().toString()}_${file.name}`;
      const task = this.storage.upload(filePath, file);
     
      const percentageChanges = task.percentageChanges().pipe(tap(data=>{
        console.log("percentage: ", data)
      }));
      const snapshotChanges = task.snapshotChanges().pipe(tap(data=>{
        console.log("snapshot: ", data)
      }));

      percentageChanges.subscribe(data=>{
        console.log("subscription: percentage: ", data)

      })

      snapshotChanges.subscribe(data=>{
        console.log("subscription: snapshotChanges: ", data)

      })

      task.then(data=>console.log("DATA:",data.ref.getDownloadURL().then(function(downloadURL) {
        console.log("File available at", downloadURL);
      })))
      


      // if (this.editMode) {
      //   this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      // } else {
      //   this.recipeService.addRecipe(this.recipeForm.value);
      // }

      // this.onCancel();
    })
  }

  onCancel() {
    this.router.navigate(['/my-blends'], { relativeTo: this.route });
  }
  private initForm() {
    let recipeName = '';
    let recipeImage = '';
    let recipeDescription = '';
    let recipeOilsUsed = [];

    // if (this.editMode) {
    //   const recipe = this.recipeService.getRecipe(this.id);
    //   recipeName = recipe.name;
    //   recipeImagePath = recipe.imagePath;
    //   recipeDescription = recipe.description;
    //   if (recipe['ingredients']) {
    //     for (let ingredient of recipe.ingredients) {
    //       recipeIngredients.push(
    //         new FormGroup({
    //           name: new FormControl(ingredient.name, Validators.required),
    //           amount: new FormControl(ingredient.amount, [
    //             Validators.required,
    //             Validators.pattern(/^[1-9]+[0-9]*$/)
    //           ])
    //         })
    //       );
    //     }
    //   }
    // }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      image: new FormControl(recipeImage, Validators.required),
      oils: new FormControl(recipeOilsUsed,[Validators.required])
    });
  }
}
