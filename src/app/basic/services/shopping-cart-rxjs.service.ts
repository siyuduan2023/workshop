import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartSummary, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartRxjsService {
  // TODO: Create a private BehaviorSubject to hold cart items
  // HINT: Use BehaviorSubject<CartItem[]> and initialize with empty array
  // LEARNING: BehaviorSubject is perfect for state management because:
  // - It holds the current state (last emitted value)
  // - New subscribers immediately get the current state
  // - It's a special type of Subject that requires an initial value
  // SYNTAX: private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  // TODO: Create a public observable that components can subscribe to
  // HINT: Use asObservable() to expose the subject as an observable
  // LEARNING: This pattern hides the Subject's next() method from consumers
  // Components can only read the stream, not modify it directly
  // SYNTAX: public items$ = this.itemsSubject.asObservable();
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    // TODO: Load items from localStorage if available
    // HINT: Call loadCartFromStorage() method
    // LEARNING: Initialize cart state when service is created
    this.loadCartFromStorage();
    console.log('Cart initialized');
  }

  // TODO: Implement addItem method
  // REQUIREMENTS:
  // 1. Check if item already exists in cart (by productId)
  // 2. If exists: increase quantity by 1 using updateQuantity()
  // 3. If not exists: create new CartItem and add to cart
  // 4. Save to localStorage after changes
  //
  // BUSINESS LOGIC:
  // - Each product can only appear once in cart (different quantities)
  // - New items start with quantity = 1
  // - Use immutable patterns (don't mutate existing arrays)
  //
  // HINTS:
  // - Get current items: this.itemsSubject.value
  // - Find existing: currentItems.find(item => item.productId === product.id)
  // - Create new CartItem with: id, productId, name, price, quantity, image, category, discount
  // - Update BehaviorSubject: this.itemsSubject.next(newArray)
  // - Generate ID: this.generateId()
  addItem(product: Product): void {
    // TODO: Implement this method
    //throw new Error('addItem method not implemented yet');
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      // TODO: Update quantity
      existingItem.quantity += 1;
    } else {
      // TODO: Create new CartItem and add to array
      const newItem: CartItem = {
        id: this.generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
        discount: product.discount,
      };
      currentItems.push(newItem);
    }

    // TODO: Update BehaviorSubject and save to storage
    this.itemsSubject.next(currentItems);
    this.saveCartToStorage();
  }

  // TODO: Implement removeItem method
  // REQUIREMENTS:
  // 1. Remove item by productId from cart
  // 2. Update the BehaviorSubject with filtered array
  // 3. Save to localStorage
  //
  // HINTS:
  // - Get current items: this.itemsSubject.value
  // - Filter out target: currentItems.filter(item => item.productId !== productId)
  // - Update subject: this.itemsSubject.next(filteredItems)
  // - Save: this.saveCartToStorage()
  removeItem(productId: string): void {
    // TODO: Implement this method
    //throw new Error('removeItem method not implemented yet');
    const currentItems = this.itemsSubject.value;
    const updatedItems = currentItems.filter(item => item.productId !== productId);
    this.itemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  // TODO: Implement updateQuantity method
  // REQUIREMENTS:
  // 1. If quantity <= 0, remove the item entirely
  // 2. Otherwise, update the item's quantity
  // 3. Save to localStorage
  //
  // EDGE CASES:
  // - Handle quantity 0 or negative (remove item)
  // - Update only the matching item, keep others unchanged
  //
  // HINTS:
  // - Check if quantity <= 0, then call this.removeItem(productId)
  // - Use map() to transform array: items.map(item => condition ? updatedItem : item)
  // - Use spread operator for immutable updates: { ...item, quantity }
  updateQuantity(productId: string, quantity: number): void {
    // TODO: Implement this method
    //throw new Error('updateQuantity method not implemented yet');
    if (quantity <=0 ) {
      this.removeItem(productId);
    } else {
      const currentItems = this.itemsSubject.value;
      const updatedItems = currentItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      this.itemsSubject.next(updatedItems);
      this.saveCartToStorage();
    }
  }

  // TODO: Implement clearCart method
  // REQUIREMENTS:
  // 1. Set items to empty array
  // 2. Save to localStorage
  //
  // HINTS:
  // - Use this.itemsSubject.next([])
  // - Call this.saveCartToStorage()
  clearCart(): void {
    // TODO: Implement this method
    //throw new Error('clearCart method not implemented yet');
    this.itemsSubject.next([]);
    this.saveCartToStorage();
  }

  // TODO: Implement getCartSummary method that returns Observable<CartSummary>
  // REQUIREMENTS:
  // 1. Calculate totalItems (sum of all quantities)
  // 2. Calculate totalPrice (sum of price * quantity for each item)
  // 3. Calculate totalDiscount (sum of discount amounts)
  // 4. Calculate tax (8% of subtotal after discounts)
  // 5. Calculate finalPrice (totalPrice - totalDiscount + tax)
  //
  // RXJS PATTERNS:
  // - Use this.items$.pipe(map(items => { ... }))
  // - Transform the items array into a CartSummary object
  // - This creates a reactive stream that updates when cart changes
  //
  // BUSINESS LOGIC:
  // - totalItems: sum of all item quantities
  // - totalPrice: sum of (price × quantity) for each item
  // - totalDiscount: sum of (price × quantity × discount%) for each item
  // - tax: 8% of (totalPrice - totalDiscount)
  // - finalPrice: totalPrice - totalDiscount + tax
  //
  // HINTS:
  // - Use reduce() for calculations: items.reduce((sum, item) => sum + value, 0)
  // - Discount calculation: (item.price * item.quantity * (item.discount || 0) / 100)
  // - Return CartSummary object with all calculated properties
  getCartSummary(): Observable<CartSummary> {
    // TODO: Implement this method
    // SYNTAX HINT:
    return this.items$.pipe(
      map(items => {
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum  + item.price * item.quantity, 0);
        const totalDiscount = items.reduce((sum, item) => sum + (item.price * item.quantity * (item.discount || 0) / 100), 0);
        const tax = (totalPrice - totalDiscount) * 0.08;
        const finalPrice = totalPrice - totalDiscount + tax;
        return { totalItems, totalPrice, totalDiscount, tax, finalPrice };
      })
    );

    // TEMPORARY: Return empty summary observable for compilation - students must implement calculations
    // return this.items$.pipe(
    //   map(() => ({
    //     totalItems: 0,
    //     totalPrice: 0,
    //     totalDiscount: 0,
    //     tax: 0,
    //     finalPrice: 0,
    //   }))
    // );
  }

  // TODO: Implement getTotalItems method
  // REQUIREMENTS:
  // 1. Return Observable<number> of total items count
  // 2. Use items$ observable and map to total quantity
  //
  // HINTS:
  // - Use this.items$.pipe(map(items => ...))
  // - Sum quantities: items.reduce((sum, item) => sum + item.quantity, 0)
  getTotalItems(): Observable<number> {
    // TODO: Implement this method
    // SYNTAX HINT:
    return this.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );

    // TEMPORARY: Return zero items observable for compilation - students must implement counting
    //return this.items$.pipe(map(() => 0));
  }

  // Helper methods (already implemented for you)
  // These handle utility functions like ID generation and localStorage
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'cart-items',
        JSON.stringify(this.itemsSubject.value)
      );
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedItems = localStorage.getItem('cart-items');
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems) as CartItem[];
          this.itemsSubject.next(items);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }
}
