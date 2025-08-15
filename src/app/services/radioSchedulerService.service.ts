import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  playlistId: string;
}

@Injectable({ providedIn: 'root' })
export class RadioSchedulerService {

  constructor(private http: HttpClient) {}

  loadTracks(playlistId?: string): Observable<Track[]> {
    return this.http.get<Record<string, string[]>>('assets/audio/catalog.json').pipe(
      map(catalog => {
        const ids = Object.keys(catalog);
        if (!ids.length) return [];

        const pid = playlistId && catalog[playlistId]
          ? playlistId
          : ids[Math.floor(Math.random() * ids.length)];

        return (catalog[pid] || []).map(path => {
          const name = path.split('/').pop() || path;
          return {
            id: `${pid}:${name}`,
            title: name.replace(/\.[^/.]+$/, ''),
            url: `assets/audio/${path}`,
            playlistId: pid
          } as Track;
        });
      })
    );
  }
}
