import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../services/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {

  users: User[] = [];
  form: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('COMPONENTE USERS INICIALIZOU');
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(99)]]
    });

    this.loadUsers();
  }

  loadUsers() {
    console.log('CHAMOU LOAD USERS');

    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('RESPOSTA:', data);

        this.users = data;

        this.cdr.detectChanges(); 

        console.log('USERS ATUAL:', this.users);
     },
     error: (err) => console.error(err)
   });
 }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user: User = {
      ...this.form.value,
      age: Number(this.form.value.age)
    };

    this.userService.createUser(user).subscribe(() => {
      this.form.reset();
      this.loadUsers();
    });
  }

  deleteUser(id: string | undefined) {
    if (!id) return;    

    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }
}
