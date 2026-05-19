import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import { UserService, User } from '../services/user';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatSnackBarModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {

  users: User[] = [];
  editingUserId: string | null = null;
  searchTerm = '';
  form: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log('COMPONENTE USERS INICIALIZOU');
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(99)]]
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
   filteredUsers() {

      return this.users.filter(user =>

        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||

        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())

      );

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

    if (this.editingUserId) {

  this.userService.updateUser(this.editingUserId, user)
    .subscribe(() => {

  this.snackBar.open(
    'Usuário atualizado com sucesso!',
    'Fechar',
    {
      duration: 3000
    }
 );

      this.form.reset();

      this.editingUserId = null;

      this.loadUsers();

      setTimeout(() => {
     
      }, 3000);

    });

} else {

  this.userService.createUser(user)
    .subscribe(() => {

  this.snackBar.open(
    'Usuário cadastrado com sucesso!',
    'Fechar',
    {
      duration: 3000
    }
 );

      this.form.reset();

      this.loadUsers();

      setTimeout(() => {
        
      }, 3000);

    });

}


}

  deleteUser(id: string | undefined) {
    if (!id) return;    

    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
         
      this.snackBar.open(
        'Usuário removido com sucesso!',
        'Fechar',
        {
          duration: 3000
        }
      );

    });

  }

  editUser(user: User) {

    this.editingUserId = user.id || null;

    this.form.patchValue({
      name: user.name,
      email: user.email,
      age: user.age
    });

 }

 }
