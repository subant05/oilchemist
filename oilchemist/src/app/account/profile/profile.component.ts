import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms'
import { RecipeService } from 'src/app/recipes/recipe.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  isProfileEdit: boolean = false
  oilBrands:{label:string, value:string}[] = []
  previousSelectedOilBrand: {label:string, value:string}
  profileInterests:string[] = []
  previousSelectedInterest: {label:string, value:string}

  constructor(private recipeService: RecipeService) {
    this.oilBrands = this.recipeService.brands
    this.profileInterests = this.recipeService.categories
   }

  get brands(){
    return (<FormArray>this.profileForm.get('brands')).controls
  }
  
  get interests(){
    return (<FormArray>this.profileForm.get('interests')).controls
  }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl(null,[Validators.required])
      , description: new FormControl(null,[Validators.required])
      , username: new FormControl(null,[Validators.required])
      , interest: new FormArray([],Validators.required)
      , brands: new FormArray([],Validators.required)
      , interests: new FormArray([],Validators.required)
    })
  }

  onEnterEditMode(){
    this.isProfileEdit = true
  }

  onExitEditMode(){
    this.isProfileEdit = false
  }

  onAddOilBrand() {
    (<FormArray>this.profileForm.get('brands')).push(
      new FormControl(null, [Validators.required])
    );
    // this.previousSelectedOilBrand = this.profileInterests()

  }
  
  onAddInterest() {
    (<FormArray>this.profileForm.get('interests')).push(
      new FormControl('health', [Validators.required])
    );
  }

  onBrandChange(event: any){
    if(event.target.value === "other"){
      event.target.nextElementSibling.value = ""
      event.target.nextElementSibling.type = "text"
      event.target.parentNode.removeChild(event.target)
      
    }
  }

  onInterestChange(event: any){
    if(event.target.value === "other"){
      event.target.nextElementSibling.value = ""
      event.target.nextElementSibling.type = "text"
      event.target.parentNode.removeChild(event.target)
      
    }
  }

  onDeleteBrand(index: number) {
    (<FormArray>this.profileForm.get('brands')).removeAt(index);
  }

  onDeleteInterest(index: number) {
    (<FormArray>this.profileForm.get('interests')).removeAt(index);
  }

  onSubmit(){

  }
}
