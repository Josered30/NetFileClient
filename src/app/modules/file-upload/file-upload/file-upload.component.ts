import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @ViewChild('fileInput')
  input!: ElementRef<HTMLInputElement>;

  formGroup = this.formBuilder.group({
    file: new FormControl(null, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    fileData: new FormControl('', [Validators.required]),
    storageType: new FormControl(true),
  });

  uploaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.formGroup.disable();
  }

  fileInputSelected() {
    this.input.nativeElement.click();
  }

  onFileSelected($event: any) {
    this.uploaded = false;

    if ($event.target.files && $event.target.files.length) {
      const [file] = $event.target.files;
      //this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        const nameAux: string[] = file.name.split('.');
        const name = nameAux.slice(0, -1).join('');

        this.formGroup.patchValue({
          file: file,
          fileData: reader.result,
          name: name,
          storageType: true,
        });
        this.formGroup.enable();
        // need to run CD since file load runs outside of zone
       // this.changeDetector.markForCheck();
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmit($event: any) {
    $event.preventDefault();
  }

  onStorageChange($event: any) {
    this.formGroup.patchValue({
      storageType: $event.checked,
    });
    //this.changeDetector.markForCheck();
  }

  async upload() {
    try {
      if (this.formGroup.valid) {
        console.log('valid');

        const storage = this.storageCheck ? 0 : 1;
        const data = await this.fileService.uploadFile(
          this.file,
          this.fileName,
          storage
        );
        console.log(data);
        this.uploaded = true;

        this.formGroup.reset();
        this.formGroup.disable();
      }
    } catch (e) {
      console.log(e);
    }
  }

  get file() {
    return this.formGroup.get('file')?.value;
  }

  get fileData() {
    return this.formGroup.get('fileData')?.value;
  }

  get fileName() {
    return this.formGroup.get('name')?.value;
  }

  get storageCheck() {
    return this.formGroup.get('storageType')?.value;
  }
}
