import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { ProfileService } from 'src/app/account/profile/profile.service';
import { Profile } from 'src/app/account/profile/profile.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.less']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  private initSubscription: Subscription;

  recipe: Recipe
  Object = Object
  public defaultPicture
  public creator: string

  constructor(private recipeService: RecipeService
    , private profileService: ProfileService
    , private router: Router
    , private route: ActivatedRoute ) {
      this.defaultPicture = this.recipeService.picture
     }
  
  ngOnInit(): void {
    this.initSubscription = this.route.params.subscribe((params: Params) => {
      this.recipeService.getRecipe(params['id']).subscribe(data=>{
        this.recipe = data;
         this.profileService.getUserNameById(data.creator).subscribe(data=>{
          this.creator = `@${data[0].username}`;
         })
      });
    });
  }

  ngOnDestroy(){
    this.initSubscription.unsubscribe()
  }

}
