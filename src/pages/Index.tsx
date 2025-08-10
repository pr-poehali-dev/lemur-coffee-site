import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface DrinkItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'tea' | 'cold' | 'dessert';
  isNew?: boolean;
  discount?: number;
}

interface CartItem extends DrinkItem {
  quantity: number;
}

const Index = () => {
  const [drinks, setDrinks] = useState<DrinkItem[]>([
    { id: '1', name: 'Классический эспрессо', description: 'Насыщенный итальянский эспрессо', price: 180, category: 'coffee' },
    { id: '2', name: 'Капучино лемур', description: 'Нежный капучино с авторским рисунком', price: 280, category: 'coffee', isNew: true },
    { id: '3', name: 'Зеленый чай с жасмином', description: 'Ароматный зеленый чай премиум класса', price: 220, category: 'tea' },
    { id: '4', name: 'Фраппе с малиной', description: 'Освежающий холодный напиток', price: 320, category: 'cold', discount: 15 },
    { id: '5', name: 'Чизкейк с ягодами', description: 'Нежный десерт от шеф-кондитера', price: 380, category: 'dessert', isNew: true }
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cities] = useState(['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург']);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newDrink, setNewDrink] = useState<Partial<DrinkItem>>({});

  const addToCart = (drink: DrinkItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === drink.id);
      if (existing) {
        return prev.map(item => 
          item.id === drink.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...drink, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => {
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const addNewDrink = () => {
    if (newDrink.name && newDrink.price && newDrink.category) {
      const drink: DrinkItem = {
        id: Date.now().toString(),
        name: newDrink.name,
        description: newDrink.description || '',
        price: Number(newDrink.price),
        category: newDrink.category as DrinkItem['category'],
        isNew: newDrink.isNew || false,
        discount: newDrink.discount || undefined
      };
      setDrinks(prev => [...prev, drink]);
      setNewDrink({});
      setIsAdminOpen(false);
    }
  };

  const deleteDrink = (id: string) => {
    setDrinks(prev => prev.filter(drink => drink.id !== id));
  };

  const newItems = drinks.filter(drink => drink.isNew);
  const discountItems = drinks.filter(drink => drink.discount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-mint-50" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/img/f58b4aed-af91-4db7-ab40-d20742f45668.jpg" alt="Lemurr Coffee" className="h-12 w-12 rounded-full object-cover" />
              <h1 className="text-2xl font-bold text-rose-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Lemurr Coffee
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-rose-500">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                    <SheetDescription>Ваш заказ</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-muted-foreground">Корзина пуста</p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.discount ? (
                                  <>
                                    <span className="line-through">{item.price}₽</span>{' '}
                                    <span className="text-rose-600">{Math.round(item.price * (1 - item.discount / 100))}₽</span>
                                  </>
                                ) : (
                                  `${item.price}₽`
                                )}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span>{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Итого:</span>
                            <span>{Math.round(getTotalPrice())}₽</span>
                          </div>
                          <Button className="w-full mt-4 bg-rose-500 hover:bg-rose-600">
                            Оформить заказ
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              
              <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Icon name="Settings" size={20} />
                    Управление
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Панель управления</DialogTitle>
                    <DialogDescription>Добавьте новый напиток в меню</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Название</Label>
                      <Input
                        id="name"
                        value={newDrink.name || ''}
                        onChange={(e) => setNewDrink(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={newDrink.description || ''}
                        onChange={(e) => setNewDrink(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Цена</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newDrink.price || ''}
                        onChange={(e) => setNewDrink(prev => ({ ...prev, price: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Категория</Label>
                      <Select
                        value={newDrink.category}
                        onValueChange={(value) => setNewDrink(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coffee">Кофе</SelectItem>
                          <SelectItem value="tea">Чай</SelectItem>
                          <SelectItem value="cold">Холодные напитки</SelectItem>
                          <SelectItem value="dessert">Десерты</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addNewDrink} className="w-full">
                      Добавить напиток
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-rose-100 to-mint-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-rose-800 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Добро пожаловать в Lemurr Coffee
          </h2>
          <p className="text-xl text-rose-700 mb-8 max-w-2xl mx-auto">
            Уютная атмосфера, ароматный кофе и дружелюбные лемуры ждут вас в наших кофейнях
          </p>
          <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white">
            <Icon name="Coffee" size={20} className="mr-2" />
            Посмотреть меню
          </Button>
        </div>
      </section>

      {/* New Items Section */}
      {newItems.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 text-rose-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🆕 Новинки
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newItems.map(drink => (
                <Card key={drink.id} className="hover:shadow-lg transition-shadow border-mint-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-rose-700">{drink.name}</CardTitle>
                      <Badge className="bg-mint-500 text-white">Новинка</Badge>
                    </div>
                    <CardDescription>{drink.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-rose-600">{drink.price}₽</span>
                      <Button onClick={() => addToCart(drink)} className="bg-mint-500 hover:bg-mint-600">
                        <Icon name="Plus" size={16} className="mr-1" />
                        В корзину
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Discounts Section */}
      {discountItems.length > 0 && (
        <section className="py-16 bg-rose-50">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 text-rose-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🏷️ Акции
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discountItems.map(drink => (
                <Card key={drink.id} className="hover:shadow-lg transition-shadow border-rose-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-rose-700">{drink.name}</CardTitle>
                      <Badge variant="destructive">-{drink.discount}%</Badge>
                    </div>
                    <CardDescription>{drink.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg line-through text-muted-foreground">{drink.price}₽</span>
                        <span className="text-2xl font-bold text-rose-600 ml-2">
                          {Math.round(drink.price * (1 - (drink.discount || 0) / 100))}₽
                        </span>
                      </div>
                      <Button onClick={() => addToCart(drink)} className="bg-rose-500 hover:bg-rose-600">
                        <Icon name="Plus" size={16} className="mr-1" />
                        В корзину
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-rose-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ☕ Наше меню
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drinks.map(drink => (
              <Card key={drink.id} className="hover:shadow-lg transition-shadow relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-rose-700">{drink.name}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteDrink(drink.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                  <CardDescription>{drink.description}</CardDescription>
                  <div className="flex space-x-2">
                    {drink.isNew && <Badge className="bg-mint-500 text-white">Новинка</Badge>}
                    {drink.discount && <Badge variant="destructive">-{drink.discount}%</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      {drink.discount ? (
                        <>
                          <span className="text-lg line-through text-muted-foreground">{drink.price}₽</span>
                          <span className="text-2xl font-bold text-rose-600 ml-2">
                            {Math.round(drink.price * (1 - drink.discount / 100))}₽
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-rose-600">{drink.price}₽</span>
                      )}
                    </div>
                    <Button onClick={() => addToCart(drink)} className="bg-mint-500 hover:bg-mint-600">
                      <Icon name="Plus" size={16} className="mr-1" />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 bg-mint-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-rose-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            🌍 Наши города
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon name="MapPin" size={48} className="mx-auto text-mint-600 mb-4" />
                  <h4 className="text-xl font-semibold text-rose-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {city}
                  </h4>
                  <p className="text-muted-foreground mt-2">Найти кофейню</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rose-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Lemurr Coffee</h4>
              <p className="text-rose-200">Лучший кофе в городе с заботой о каждом госте</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Контакты</h5>
              <div className="space-y-2 text-rose-200">
                <p>📞 +7 (495) 123-45-67</p>
                <p>📧 hello@lemurr-coffee.ru</p>
                <p>🕒 Ежедневно с 7:00 до 23:00</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Социальные сети</h5>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="border-rose-200 text-rose-200 hover:bg-rose-700">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button variant="outline" size="icon" className="border-rose-200 text-rose-200 hover:bg-rose-700">
                  <Icon name="Facebook" size={20} />
                </Button>
                <Button variant="outline" size="icon" className="border-rose-200 text-rose-200 hover:bg-rose-700">
                  <Icon name="Twitter" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-rose-700 mt-8 pt-8 text-center text-rose-200">
            <p>&copy; 2024 Lemurr Coffee. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;