import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-playlist-picker',
  templateUrl: './playlist-picker.component.html',
  styleUrls: ['./playlist-picker.component.scss']
})
export class PlaylistPickerComponent {

  constructor(
    public dialogRef: MatDialogRef<PlaylistPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { playlistIds: string[]; selectedId?: string }
  ) {}

  choosePlaylist(pid: string): void {
    this.dialogRef.close(pid);
  }
  
  randomPlaylist(): void {
    this.dialogRef.close('');
  }
}
