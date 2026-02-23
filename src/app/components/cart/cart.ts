import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { CartItem } from './cart-item.models';
import { CartService } from './cart.service';
import { OrderService } from './order.service';
import { loggedIn, getClientId } from '../../signals/loginData';
import { UserCallbackService } from '../usersManagement/register/userCallback.service';
import { UserService } from '../usersManagement/register/user.service';
import { UserComponentMode } from '../usersManagement/register/userForm';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, CardModule, AvatarModule]
})
export class CartComponent implements OnInit {
  private readonly  callback = inject(UserCallbackService);
  private readonly router = inject(Router);
  private userService = inject(UserService);    

  // Exponer funcion al template (cosas raras de Angular, no se puede usar directamente la funcion importada)
  loggedIn = loggedIn;
  userId = getClientId();

  items: CartItem[] = [];
  email = '';
  addressId!: number;
  protected message = signal<string>('');
  // Para evitar varios clicks...
  processing = signal(false);

  constructor(
    public cartService: CartService,
    private orderService: OrderService
  ) {}

  get sinDatosEnvio() {
    return computed(() => !this.cartService.hayDatosEnvio());
  }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.items = this.cartService.items();
  }

  onQuantityChange(id: number, quantity: any) {
    const qty = +quantity;
    this.cartService.updateQuantity(id, qty);
    this.loadItems();
  }

  remove(id: number) {
    this.cartService.removeProduct(id);
    this.loadItems();
  }

  total(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  recogerDatosEnvio() {
    //Establecer función de callback:
    this.callback.onSuccess = (user, addressName, address, addressId, roles) => {
      console.log("Datos recogidos");      
      this.cartService.hayDatosEnvio.set(true);
      this.cartService.user = user;
      this.cartService.address = address;
      this.router.navigate(['/cart'])            
    };
    this.callback.onCancel = () => {
      //En el cancel volver a esta vista
      this.router.navigate(['/cart'])
    };        
    this.router.navigate(['/user', UserComponentMode.onlyToSend]);
  }

  checkout() {
    // Si esta procesando algo anterior volver...
    if (this.processing()) return;

    this.processing.set(true);

    this.orderService.createOrder(this.userId!, this.items).subscribe({
      next: res => {
        console.log('Pedido creado', res);
        this.cartService.clearCart(); // vaciar carrito
        //this.items = []; // actualizar UI
        this.message.set(`Se realizo el pedido`)
        // Quitar mensaje en 3 segundos...
        setTimeout(() => this.message.set(''), 3000);
      },
      error: err => {
        if (err.status === 422) {
          console.error('Errores de validación', err.error.errors);
        } else {
          console.error('Error al crear pedido', err);
        }
      },
        complete: () => {
          this.processing.set(false);
        }
    });
  }

  

  checkoutFast() {
    // Si esta procesando algo anterior volver...
    if (this.processing()) return;

    this.processing.set(true);

    
      this.orderService.createFastOrder(this.cartService.user!, this.cartService.address!, this.items).subscribe({
        next: res => {
          console.log('Pedido creado', res);
          this.cartService.clearCart(); // vaciar carrito
          //this.items = []; // actualizar UI
          this.message.set(`Se realizo el pedido`)
          // Quitar mensaje en 3 segundos...
          setTimeout(() => this.message.set(''), 3000);
        },
        error: err => {
          if (err.status === 422) {
            console.error('Errores de validación', err.error.errors);
          } else {
            console.error('Error al crear pedido', err);
          }
        },
          complete: () => {
            this.processing.set(false);
          }
      });    
  }
}
