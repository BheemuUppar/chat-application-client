import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

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
}
