import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = environment.NEWS_URL;

  constructor(private http: HttpClient) { }

  getNews(query: any) {
    const obj = {
      country: query && query.country || 'ua',
      category: query && query.category || '',
      q: query && query.searchText || '',
      pageSize: query && query.limit || 8,
      page: query && query.page || 1
    };
    const params = new HttpParams({ fromObject: obj });
    return this.http.get(`${this.apiUrl}`, { params });
  }
}
