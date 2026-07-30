import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

export interface TutorialVideo {
  id: number;
  name: string;
  secure_url: string;
  video_source: string;
  thumbnail_url: string;
  video_title: string;
  sequence: number;
}

@Component({
  selector: 'app-client-faq',
  templateUrl: './client-faq.page.html',
  styleUrls: ['./client-faq.page.scss'],
})
export class ClientFaqPage extends ApiService implements OnInit {

  tutorialVideos: TutorialVideo[] = [];
  isLoadingVideos: boolean = false;
  videoError: string = '';
  familyId: number = 0;

  constructor(
    http: HttpClient,
    private functionMain: FunctionMainService
  ) {
    super(http);
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const value = await this.functionMain.vmsPreferences();
      if (value && value.family_id) {
        this.familyId = value.family_id;
        this.loadTutorialVideos();
      } else {
        this.loadTutorialVideos();
      }
    } catch (e) {
      this.loadTutorialVideos();
    }
  }

  async loadTutorialVideos() {
    this.isLoadingVideos = true;
    this.videoError = '';
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
      const response: any = await this.http
        .post(
          this.baseUrl + '/api/tutorial-videos',
          {
            jsonrpc: '2.0',
            params: {
              family_id: this.familyId
            }
          },
          { headers }
        )
        .pipe(catchError(this.handleError))
        .toPromise();

      if (response?.result?.status === 'ok') {
        this.tutorialVideos = response.result.data as TutorialVideo[];
      } else {
        this.videoError = 'Failed to load tutorial videos.';
      }
    } catch (err) {
      this.videoError = 'Unable to connect. Please try again.';
    } finally {
      this.isLoadingVideos = false;
    }
  }

  openVideo(link: string) {
    if (!link) return;
    window.open(link, '_system');
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
