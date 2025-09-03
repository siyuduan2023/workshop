import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, CartSummary, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class CartComputedService {
  // TODO: Create private writable signals for cart state
  // HINT: Use signal<CartItem[]>([]) for items
  // HINT: Use signal<string>('all') for selectedCategory
  // HINT: Use signal<string>('') for searchQuery
  // HINT: Use signal<'asc' | 'desc'>('asc') for sortOrder
  // LEARNING: Signals are the new reactive primitive in Angular
  // - They automatically track dependencies
  // - Components can read them directly in templates
  // - Updates are fine-grained and efficient
  private items = signal<CartItem[]>([]);
  private selectedCategory = signal<string>('all');
  private searchQuery = signal<string>('');
  private sortOrder = signal<'asc' | 'desc'>('asc');

  // TODO: Create readonly signals for external access
  // HINT: Use asReadonly() to expose signals that cannot be modified from outside
  // LEARNING: This protects your internal state while allowing components to read values
  // SYNTAX: public readonly cartItems = this.items.asReadonly();
  // SYNTAX: public readonly currentCategory = this.selectedCategory.asReadonly();
  // SYNTAX: public readonly currentSearch = this.searchQuery.asReadonly();
  // SYNTAX: public readonly currentSort = this.sortOrder.asReadonly();
  public readonly cartItems = this.items.asReadonly();
  public readonly currentCategory = this.selectedCategory.asReadonly();
  public readonly currentSearch = this.searchQuery.asReadonly();
  public readonly currentSort = this.sortOrder.asReadonly();

  // TODO: Implement computed for cart summary with advanced calculations
  // REQUIREMENTS:
  // 1. Calculate totalItems (sum of all quantities)
  // 2. Calculate totalPrice (sum of price * quantity for each item)
  // 3. Calculate totalDiscount (sum of discount amounts)
  // 4. Calculate progressive tax based on subtotal:
  //    - Orders over $1000: 12% tax
  //    - Orders over $500: 10% tax
  //    - Orders under $500: 8% tax
  // 5. Calculate finalPrice (subtotal + tax)
  //
  // LEARNING: computed() creates derived state that automatically updates
  // - Dependencies are tracked automatically
  // - Only recalculates when dependencies change
  // - Memoized for performance
  //
  // SYNTAX HINT:
  // public readonly cartSummary = computed<CartSummary>(() => {
  //   const items = this.items();
  //   // ... calculations
  //   return { totalItems, totalPrice, totalDiscount, tax, finalPrice };
  // });
  public readonly cartSummary = computed<CartSummary>(() => {
    const items = this.items();
    console.log('💚Items: ', items);
    const totalItems = items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
    const totalPrice = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    // TODO: Implement advanced cart summary calculation
    // TEMPORARY: Return empty summary for compilation - students must implement proper calculations
    return {
      totalItems: totalItems,
      totalPrice: totalPrice,
      totalDiscount: 0,
      tax: 0,
      finalPrice: 0,
    };
  });

  // TODO: Implement computed for filtered and sorted items
  // REQUIREMENTS:
  // 1. Filter by selected category (if not 'all')
  // 2. Filter by search query (name or category contains search text)
  // 3. Sort by total value (price * quantity) in ascending or descending order
  //
  // LEARNING: Multi-dependency computed signals
  // - This computed depends on items, selectedCategory, searchQuery, and sortOrder
  // - Automatically updates when ANY dependency changes
  // - Efficient - only recalculates when needed
  //
  // HINTS:
  // - Get values: this.items(), this.selectedCategory(), this.searchQuery(), this.sortOrder()
  // - Filter by category: items.filter(item => item.category === category)
  // - Filter by search: items.filter(item => item.name.toLowerCase().includes(search))
  // - Sort by value: items.sort((a, b) => compare aValue and bValue)
  public readonly filteredItems = computed(() => {
    // TODO: Implement filtering and sorting logic
    // TEMPORARY: Return items as-is for basic functionality - students must implement proper filtering/sorting
    return this.items();
  });

  // TODO: Implement computed for category statistics
  // REQUIREMENTS:
  // 1. Group items by category
  // 2. Calculate count and total value per category
  // 3. Return array of { category, itemCount, totalValue }
  //
  // LEARNING: Advanced data processing with computed
  // - Use Map for efficient grouping
  // - Transform to array for easier consumption
  // - Provides real-time analytics
  //
  // HINTS:
  // - Use Map<string, { count: number; total: number }>() for grouping
  // - Iterate with items.forEach()
  // - Convert to array: Array.from(stats.entries()).map(...)
  public readonly categoryStats = computed(() => {
    // TODO: Implement category statistics calculation
    // TEMPORARY: Return basic stats structure for compilation - students must implement proper analysis
    return [
      { category: 'electronics', itemCount: 0, totalValue: 0 },
      { category: 'clothing', itemCount: 0, totalValue: 0 },
    ];
  });

  // TODO: Implement computed for discount information
  // REQUIREMENTS:
  // 1. Check if cart has any discounted items
  // 2. Count number of discounted items
  // 3. Calculate total savings
  // 4. Calculate average discount percentage
  //
  // LEARNING: Computed can depend on other computed signals
  // - This computed uses this.cartSummary().totalDiscount
  // - Creates a chain of reactive dependencies
  //
  // HINTS:
  // - Filter discounted items: items.filter(item => item.discount && item.discount > 0)
  // - Use this.cartSummary().totalDiscount for total savings
  // - Calculate average: sum of discounts / number of discounted items
  public readonly discountInfo = computed(() => {
    // TODO: Implement discount information calculation
    // TEMPORARY: Return empty discount info for compilation - students must implement discount logic
    return {
      hasDiscounts: false,
      discountedItemsCount: 0,
      totalSavings: 0,
      averageDiscount: 0,
    };
  });

  // TODO: Implement computed for shipping information
  // REQUIREMENTS:
  // 1. Free shipping threshold: $500
  // 2. Standard shipping cost: $15
  // 3. Calculate if eligible for free shipping
  // 4. Calculate amount needed for free shipping
  // 5. Estimate delivery time (2-3 days free, 5-7 days standard)
  //
  // BUSINESS LOGIC:
  // - Free shipping: finalPrice >= $500
  // - Shipping cost: $0 if free, $15 if standard
  // - Amount for free shipping: Math.max(0, $500 - finalPrice)
  public readonly shippingInfo = computed(() => {
    // TODO: Implement shipping calculation
    // TEMPORARY: Return default shipping info for compilation - students must implement shipping logic
    return {
      isEligibleForFreeShipping: false,
      isFreeShipping: false, // Template compatibility
      shippingCost: 15,
      amountForFreeShipping: 500,
      estimatedDelivery: '5-7 business days',
    };
  });

  // TODO: Implement computed for recommendations
  // REQUIREMENTS:
  // 1. Get unique categories from current cart
  // 2. Recommend categories not in cart (from: electronics, clothing, books)
  // 3. Calculate total unique items and average item price
  //
  // LEARNING: Advanced array operations in computed
  // - Use Set for unique values: [...new Set(items.map(...))]
  // - Filter for recommendations: categories.filter(cat => !inCart.includes(cat))
  public readonly recommendations = computed(() => {
    // TODO: Implement recommendations calculation
    // TEMPORARY: Return empty recommendations for compilation - students must implement recommendation logic
    return {
      suggestedCategories: [],
      totalUniqueItems: 0,
      averageItemPrice: 0,
    };
  });

  constructor() {
    // TODO: Load cart from localStorage
    // HINT: Call loadCartFromStorage() method
    this.loadCartFromStorage();

    // TODO: Effect for auto-saving cart
    // REQUIREMENTS:
    // 1. Create effect that runs when items() signal changes
    // 2. Call saveCartToStorage() to persist changes
    //
    // LEARNING: Effects handle side effects
    // - Automatically run when dependencies change
    // - Perfect for persistence, logging, analytics
    // - No manual subscription management needed
    //
    // SYNTAX HINT:
    // effect(() => {
    //   this.saveCartToStorage();
    // });
    effect(() => {
      this.saveCartToStorage();
    });

    // TODO: Effect for logging cart changes
    // REQUIREMENTS:
    // 1. Create effect that logs cart analytics when cart changes
    // 2. Only log when cart has items (avoid empty cart noise)
    // 3. Log: total items, final price, number of categories
    //
    // LEARNING: Conditional effects
    // - Use if statements inside effects
    // - Can depend on multiple computed signals
    // - Automatically batched for efficiency
    //
    // SYNTAX HINT:
    // effect(() => {
    //   const summary = this.cartSummary();
    //   if (summary.totalItems > 0) {
    //     console.log('Cart updated:', { ... });
    //   }
    // });
    effect(() => {
      const summary = this.cartSummary();
      if (summary.totalItems > 0) {
        console.log('Cart updated - TODO: Implement proper logging');
      }
    });
  }

  // TODO: Implement basic cart operations using signals
  // LEARNING: Signal updates vs RxJS
  // - RxJS: this.itemsSubject.next(newValue)
  // - Signals: this.items.set(newValue) or this.items.update(fn)
  // - Signals: Automatic computed recalculation
  // - Signals: Automatic effect execution

  // TODO: Implement addItem method
  // REQUIREMENTS:
  // 1. Check if item exists by productId
  // 2. If exists: use updateQuantity to increase by 1
  // 3. If new: create CartItem and use this.items.update() to add it
  //
  // HINTS:
  // - Get current items: this.items()
  // - Find existing: items.find(item => item.productId === product.id)
  // - Update signal: this.items.update(items => [...items, newItem])
  addItem(product: Product): void {
    // TODO: Implement this method
    throw new Error('addItem method not implemented yet');
  }

  // TODO: Implement removeItem method
  // REQUIREMENTS:
  // 1. Remove item by productId using filter
  // 2. Update the items signal
  //
  // HINTS:
  // - Use this.items.update() with filter
  // - Filter: items => items.filter(item => item.productId !== productId)
  removeItem(productId: string): void {
    // TODO: Implement this method
    throw new Error('removeItem method not implemented yet');
  }

  // TODO: Implement updateQuantity method
  // REQUIREMENTS:
  // 1. If quantity <= 0, remove the item
  // 2. Otherwise, update the item's quantity using map
  //
  // HINTS:
  // - Check quantity <= 0, call this.removeItem(productId)
  // - Use this.items.update() with map
  // - Map: items => items.map(item => condition ? {...item, quantity} : item)
  updateQuantity(productId: string, quantity: number): void {
    // TODO: Implement this method
    throw new Error('updateQuantity method not implemented yet');
  }

  // TODO: Implement clearCart method
  // REQUIREMENTS:
  // 1. Set items to empty array
  //
  // HINTS:
  // - Use this.items.set([])
  clearCart(): void {
    // TODO: Implement this method
    throw new Error('clearCart method not implemented yet');
  }

  // TODO: Implement filter and sort methods
  // LEARNING: Signal setters
  // - Use .set() to completely replace signal value
  // - These methods update filter/sort signals
  // - filteredItems computed automatically recalculates

  // TODO: Implement setCategory method
  // REQUIREMENTS: Set the selectedCategory signal
  // HINT: this.selectedCategory.set(category)
  setCategory(category: string): void {
    // TODO: Implement this method
    throw new Error('setCategory method not implemented yet');
  }

  // TODO: Implement setSearchQuery method
  // REQUIREMENTS: Set the searchQuery signal
  // HINT: this.searchQuery.set(query)
  setSearchQuery(query: string): void {
    // TODO: Implement this method
    throw new Error('setSearchQuery method not implemented yet');
  }

  // TODO: Implement setSortOrder method
  // REQUIREMENTS: Set the sortOrder signal
  // HINT: this.sortOrder.set(order)
  setSortOrder(order: 'asc' | 'desc'): void {
    // TODO: Implement this method
    throw new Error('setSortOrder method not implemented yet');
  }

  // Helper methods (already implemented for you)
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart-items-computed', JSON.stringify(this.items()));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedItems = localStorage.getItem('cart-items-computed');
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems) as CartItem[];
          this.items.set(items);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }
}
