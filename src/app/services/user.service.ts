import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';

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
    let url = 'http://localhost:3000/users/upload/profile';
    let payload = {
      id: id,
      file: file,
    };
    const formData = new FormData();

    // Append only the file to FormData
    formData.append('id', String(id));
    formData.append('file', file);
    return this.http.post(url, formData);
  }


  createGroup(params:FormData){
    return this.http.post('http://localhost:3000/users/creategroup', params)
  }

  get user() {
    let data = localStorage.getItem('user');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  getUserData(id: any) {
    let url = 'http://localhost:3000/users/getuser/' + id;
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
    let url = 'http://localhost:3000/users/search?search=' + query;
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
  let url = 'http://localhost:3000/users/getAllChats/'+id
  return this.http.get(url)
  }

  getAllMessages(inbox_id:number){
  let url = 'http://localhost:3000/users/getAllMessage/'+inbox_id
  return this.http.get(url)
  }

  getChatInfo(inbox_id:number){
    return this.http.get('http://localhost:3000/users/group/info/'+inbox_id)
  }
  getChatInfoChat(user_id:number,inbox_id:number){
    return this.http.get('http://localhost:3000/users/chat/info/'+user_id + '/' + inbox_id)
  }
  
}
