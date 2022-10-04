import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../models/template.model';
import { ResourceService } from './resource.service';

@Injectable()
export class CreatePlaceholderArtService extends ResourceService<any> {
  public articles: any[] = [];
  public templates: Template;
  public images: any[] = [];

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  getResourceUrl(): string {
    return 'createPlaceholderArt.service';
  }

  loadArticle(articles: any[]) {
    this.articles = articles;
  }

  saveArticle() {
    return this.articles;
  }

  loadTemplate(templates: Template) {
    this.templates = templates;
  }

  saveTemplate() {
    return this.templates;
  }

  loadImages(images: any[]) {
    this.images = images;
  }

  saveImages() {
    return this.images;
  }
}
