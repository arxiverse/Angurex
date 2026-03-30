# Angurex ⚛️🅰️

> Angular Developer Experience on top of React Runtime

**Angurex** adalah experimental meta-framework yang menghadirkan **arsitektur Angular 20+** di atas **React + Vite + TypeScript**.

Tujuannya:
memberikan **struktur scalable**, **dependency injection**, dan **testing API ala Angular**, tanpa meninggalkan ekosistem React.

Singkatnya:

```
Angular mental model 🧠
React rendering engine ⚛️
TypeScript safety 🔷
Vitest testing 🧪
```

---

# Features 🚀

### Angular-style Component

```ts
@Component({
 selector: 'app-login',
 templateUrl: './login.tsx',
 styleUrl: './login.css',
})
export class Login {

 ngOnInit(){
   console.log("component ready")
 }

}
```

---

### Dependency Injection (DI)

```ts
@Injectable()
export class AuthService {

 login(){
  return true
 }

}
```

gunakan di component:

```ts
import { inject } from 'angurex/core'

export class Login {

 auth = inject(AuthService)

}
```

---

### Angular-style Lifecycle

```ts
ngOnInit()
ngOnDestroy()
```

Lifecycle otomatis dijalankan dalam injection context.

---

### Template via React TSX

```tsx
const LoginComponent = ({ instance }) => {

 return (
  <h1>
   {instance?.headline}
  </h1>
 )

}
```

React tetap jadi rendering engine.

---

### Async tracking (zone-like behavior)

```ts
trackAsync(
 service.loadData()
)
```

Testing dapat menunggu async selesai:

```ts
await fixture.whenStable()
```

---

### Angular-style Testing API

```ts
describe('Login', () => {

 let component: Login
 let fixture: ComponentFixture<Login>

 beforeEach(async () => {

  await TestBed.configureTestingModule({
   imports:[Login],
  })

  await TestBed.compileComponents()

  fixture = TestBed.createComponent(Login)

  component = fixture.componentInstance

  await fixture.whenStable()

  fixture.detectChanges()

 })

 it('should create', () => {

  expect(component).toBeTruthy()

 })

})
```

---

# Project Structure 📁

```
src/

 angurex/
  core.ts
  testing.tsx

 app/

  login/
   login.ts
   login.service.ts
   login.tsx
   login.css
   login.spec.ts

 app.routes.ts
 main.tsx
```

---

# Example Component

### login.ts

```ts
import { Component, inject } from '../../angurex/core'
import { LoginService } from './login.service'

export class Login {

 loginService = inject(LoginService)

 headline = "Loading..."

 async ngOnInit(){

  this.headline =
   await this.loginService.loadHeadline()

 }

}

Component({
 selector:'app-login',
 templateUrl:'./login.tsx',
 styleUrl:'./login.css'
}, import.meta.url)(Login)
```

---

### login.service.ts

```ts
import { Injectable } from '../../angurex/core'

@Injectable()
export class LoginService {

 async loadHeadline(){

  return "Login Works 🚀"

 }

}
```

---

### login.tsx

```tsx
const LoginComponent = ({ instance }) => {

 return (
  <p>
   {instance?.headline}
  </p>
 )

}

export default LoginComponent
```

---

# Routing

Angurex menggunakan React Router sebagai router engine.

```ts
export const RoutesComponent = [

 { path:'/', loader:()=>redirect('/login') },

 { path:'/login', Component: LoginComponent },

]
```

---

# Philosophy 🧠

Angurex tidak mencoba menggantikan React.

Sebaliknya, Angurex menyediakan:

* opinionated structure
* dependency injection
* predictable architecture
* scalable pattern

untuk developer yang menyukai pola Angular namun ingin tetap menggunakan React ecosystem.

---

# Comparison

| Feature              | Angular | React     | Angurex      |
| -------------------- | ------- | --------- | ------------ |
| Component class      | yes     | optional  | yes          |
| Dependency Injection | yes     | no        | yes          |
| Lifecycle hooks      | yes     | hooks API | yes          |
| Template syntax      | HTML    | JSX       | JSX          |
| Testing API          | TestBed | custom    | TestBed-like |
| Rendering engine     | Angular | React     | React        |

---

# Status ⚠️

Experimental

Belum stabil.
API dapat berubah sewaktu-waktu.

Cocok untuk:

* research architecture
* DX experimentation
* Angular developer migrating to React
* framework enthusiasts 🤓

---

# Roadmap 🗺️

* Directive system (*ngIf, *ngFor)
* Signal reactive state
* RouterOutlet abstraction
* CLI generator
* decorator utilities
* plugin system

---

# Inspiration 💡

* Angular
* React
* NestJS
* AnalogJS
* Vite

---

# License

MIT

---

# Author

Neira 🧠⚛️

Angular jiwa, React raga.

```
```