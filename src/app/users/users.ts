import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import { UserService, User } from '../services/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {

  users: User[] = [];
  successMessage = '';
  editingUserId: string | null = null;
  searchTerm = '';
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

      this.successMessage = 'Usuário atualizado com sucesso!';

      this.form.reset();

      this.editingUserId = null;

      this.loadUsers();

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);

    });

} else {

  this.userService.createUser(user)
    .subscribe(() => {

      this.successMessage = 'Usuário cadastrado com sucesso!';

      this.form.reset();

      this.loadUsers();

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);

    });

}


}

  deleteUser(id: string | undefined) {
    if (!id) return;    

    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
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
