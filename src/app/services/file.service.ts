import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileResponse } from '../models/fileResponse.model';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private httpClient: HttpClient) {}

  async uploadFile(
    file: File,
    name: string,
    storageType: number
  ): Promise<FileResponse> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    formData.append('storageType', storageType.toString());

    const data$ = this.httpClient.post<FileResponse>(
      `${environment.api}/file`,
      formData
    );
    const data = await lastValueFrom<FileResponse>(data$);
    return data;
  }
}
