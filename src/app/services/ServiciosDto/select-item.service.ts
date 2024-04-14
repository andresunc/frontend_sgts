import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectItemDto } from 'src/app/models/ModelsDto/SelectitemsDto';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class SelectItemService {

  urlBackend = new UrlBackend().getUrlBackend();
  getSelectItemUrl = this.urlBackend + '/selectItemDto/getItems';

  constructor(private http: HttpClient) { }

  getSelectItemDto(): Observable<SelectItemDto[]> {
    return this.http.get<SelectItemDto[]>(this.getSelectItemUrl);
  }
}
