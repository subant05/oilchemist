import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http'
import { Profile } from './profile.model'
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient, private firestore: AngularFirestore) { 
    
  }

  getUserNameById(id: string): Observable<any>{
    return this.firestore.collection('profiles'
    , ref=>ref.where('userId', '==', id))
    .snapshotChanges()
    .pipe(map (actions => {
      return actions.map(a => {
          const data = a.payload.doc.data() as Profile;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }))
  }

  createUserProfile(authData:any, userData:any): Promise<any>{
    // Save user profile
      return this.firestore.collection<Profile>('profiles').add({
          email: authData.email
          , username: userData.username.toLowerCase()
          , role: "user"
          , userId: authData.localId
      })
  }
}
