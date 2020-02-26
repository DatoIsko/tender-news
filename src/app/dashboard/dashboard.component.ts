import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from '../services/news.service';
import { NewsModel } from '../models/news.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination/public_api';
import { takeUntil, debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COUNTRIES } from '../constants/countries';
import { CATEGORIES } from '../constants/categories';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  readonly countries = COUNTRIES;
  readonly categories = CATEGORIES;
  searchCountry: string;
  searchCategory: string;
  searchText: string;
  articles: NewsModel[] = [];
  totalItems: number;
  searchForm: FormGroup;
  limit = 8;
  isLoading = false;
  private unSubscribe = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private newsService: NewsService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.filterChanged();
    this.searchArticles();

  }

  pageChanged(evt: PageChangedEvent) {
    const page = evt.page;
    this.searchArticles(page);
  }

  searchArticles(page?: number) {
    const query = {
      searchText: this.searchText,
      country: this.searchCountry,
      category: this.searchCategory,
      page
    };
    this.isLoading = true;
    this.newsService.getNews(query).pipe(
      takeUntil(this.unSubscribe)
    ).subscribe((res: any) => {

      this.totalItems = res.totalResults;
      this.articles = res.articles;
      this.isLoading = false;
      console.log('res subs', res);

    });
  }


  initForm() {
    this.searchForm = this.fb.group({
      title: '',
      country: 'ua',
      category: null
    });
  }

  filterChanged() {
    this.searchForm.get('title').valueChanges.pipe(
      map((searchText) => searchText.trim().toLowerCase()),
      filter(text => text.length > 2),
      debounceTime(10),
      distinctUntilChanged(),
    )
      .subscribe((value) => {
        this.searchText = value;
        this.searchArticles();
      });

    this.searchForm.get('country').valueChanges.subscribe((value) => {
      console.log(value);
      this.searchCountry = value;
      this.searchArticles();

    });

    this.searchForm.get('category').valueChanges.subscribe((value) => {
      console.log(value);
      this.searchCategory = value;
      this.searchArticles();

    });
  }

  ngOnDestroy() {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
