import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { environment } from 'src/assets/dev.environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  onlineUsers:string[] = []
  constructor(private http: HttpClient) {}

  currentChat: BehaviorSubject<any> = new BehaviorSubject(undefined);
  currenChat$ = this.currentChat.asObservable();
  readNewMessage: Subject<any> = new Subject();
  readNewMessage$ = this.currentChat.asObservable();
  contactInfoVisible:boolean = false;

  saveProfilePic(id: string | null, file: File) {
    let url = environment.saveProfilePic;
    // let payload = {
    //   id: id,
    //   file: file,
    // };
    const formData = new FormData();

    // Append only the file to FormData
    formData.append('id', String(id));
    formData.append('file', file);
    return this.http.post(url, formData);
  }

  changeGroupProfilePic(id: string | null, file: File) {
    let url = environment.changeGroupProfilePic;
    // let payload = {
    //   id: id,
    //   file: file,
    // };
    const formData = new FormData();

    // Append only the file to FormData
    formData.append('inbox_id', String(id));
    formData.append('file', file);
    return this.http.post(url, formData);
  }


  createGroup(params:FormData){
    return this.http.post(environment.createGroup, params)
  }

  get user() {
    let data = localStorage.getItem('user');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  getUserData(id: any) {
    let url = environment.getUserData + id;
    return this.http.get(url).pipe(
      map((res: any) => {
        localStorage.setItem('user', JSON.stringify(res.data));
        return res;
      })
    );
  }

  isOnline(id:any){
    return this.onlineUsers.includes(id+'')
  }

  searchUsers(query: string | number) {
    let url = environment.searchUser + query;
    return this.http.get(url).pipe(
      map((res: any) => {
        let myId = this.user.user_id;
        res.data = res.data.filter((obj: any) => {
          return obj.user_id != myId;
        });

        return res;
      })
    );
  }

  getAllInbox(){
  let id = this.user.user_id;
  let url = environment.getAllInbox+id
  return this.http.get(url)
  }

  getAllMessages(inbox_id:number){
  let url = environment.getAllMessages+inbox_id
  return this.http.get(url)
  }

  getChatInfo(inbox_id:number){
    return this.http.get(environment.getGroupInfo+inbox_id)
  }
  getChatInfoChat(user_id:number,inbox_id:number){
    return this.http.get(environment.getChatInfo+user_id + '/' + inbox_id)
  }
  
}
