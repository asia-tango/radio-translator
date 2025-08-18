import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistPickerComponent } from './modals/playlist-picker/playlist-picker.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'radio-translator';
  isHome = true;
  activePlaylistId = '';
  showMoodBar = false;
  playlistIds: string[] = [];
  currentPlaylistId: string | null = null;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

   ngOnInit(): void {
    this.http.get<Record<string, string[]>>('assets/audio/catalog.json')
      .subscribe(cat => this.playlistIds = Object.keys(cat));

    this.route.queryParamMap.subscribe(p => {
      const pid = p.get('playlist');
      this.currentPlaylistId = pid && pid.trim() ? pid : null;
    });
  }

  openMoodDialog(): void {
    const ref = this.dialog.open(PlaylistPickerComponent, {
      data: { playlistIds: this.playlistIds, selectedId: this.currentPlaylistId },
      width: '520px',
      autoFocus: false,
      panelClass: 'playlist-dialog',
      backdropClass: 'playlist-backdrop'
    });

    ref.afterClosed().subscribe((pid?: string) => {
      if (pid === undefined) return;
      if (pid === '') {
        // Random
        this.router.navigate([], { queryParams: { playlist: null }, queryParamsHandling: 'merge' });
      } else {
        // Selected mood
        this.router.navigate([], { queryParams: { playlist: pid }, queryParamsHandling: 'merge' });
      }
    });
  }
}
