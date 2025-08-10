import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

interface SiteSettings {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  email: string;
  address: string;
}

interface AdminPanelProps {
  drinks: DrinkItem[];
  setDrinks: (drinks: DrinkItem[] | ((prev: DrinkItem[]) => DrinkItem[])) => void;
  cities: string[];
  setCities: (cities: string[] | ((prev: string[]) => string[])) => void;
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => void;
}

export default function AdminPanel({ 
  drinks, 
  setDrinks, 
  cities, 
  setCities,
  siteSettings,
  setSiteSettings 
}: AdminPanelProps) {
  const [newDrink, setNewDrink] = useState<Partial<DrinkItem>>({});
  const [newCity, setNewCity] = useState('');
  const [tempSettings, setTempSettings] = useState<SiteSettings>(siteSettings);

  const addDrink = () => {
    if (newDrink.name && newDrink.price) {
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
    }
  };

  const deleteDrink = (id: string) => {
    setDrinks(prev => prev.filter(drink => drink.id !== id));
  };

  const updateDrink = (id: string, updates: Partial<DrinkItem>) => {
    setDrinks(prev => prev.map(drink => 
      drink.id === id ? { ...drink, ...updates } : drink
    ));
  };

  const addCity = () => {
    if (newCity.trim()) {
      setCities(prev => [...prev, newCity.trim()]);
      setNewCity('');
    }
  };

  const deleteCity = (cityToDelete: string) => {
    setCities(prev => prev.filter(city => city !== cityToDelete));
  };

  const saveSettings = () => {
    setSiteSettings(tempSettings);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 z-50 shadow-lg">
          <Icon name="Settings" size={20} className="mr-2" />
          Админ панель
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Панель управления сайтом</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="drinks" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="drinks">Напитки</TabsTrigger>
            <TabsTrigger value="cities">Города</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
          </TabsList>

          <TabsContent value="drinks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Добавить напиток</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    placeholder="Название напитка"
                    value={newDrink.name || ''}
                    onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    placeholder="Описание напитка"
                    value={newDrink.description || ''}
                    onChange={(e) => setNewDrink({ ...newDrink, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Цена (₽)</Label>
                  <Input
                    type="number"
                    placeholder="Цена"
                    value={newDrink.price || ''}
                    onChange={(e) => setNewDrink({ ...newDrink, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Категория</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newDrink.category || ''}
                    onChange={(e) => setNewDrink({ ...newDrink, category: e.target.value as DrinkItem['category'] })}
                  >
                    <option value="">Выберите категорию</option>
                    <option value="coffee">Кофе</option>
                    <option value="tea">Чай</option>
                    <option value="cold">Холодные напитки</option>
                    <option value="dessert">Десерты</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newDrink.isNew || false}
                      onChange={(e) => setNewDrink({ ...newDrink, isNew: e.target.checked })}
                    />
                    Новинка
                  </label>
                </div>
                <div>
                  <Label>Скидка (%)</Label>
                  <Input
                    type="number"
                    placeholder="Скидка"
                    value={newDrink.discount || ''}
                    onChange={(e) => setNewDrink({ ...newDrink, discount: Number(e.target.value) || undefined })}
                  />
                </div>
                <Button onClick={addDrink} className="w-full">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить напиток
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="font-semibold">Существующие напитки</h3>
              {drinks.map(drink => (
                <Card key={drink.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium flex items-center gap-2">
                        {drink.name}
                        {drink.isNew && <Badge variant="secondary">NEW</Badge>}
                        {drink.discount && <Badge variant="destructive">-{drink.discount}%</Badge>}
                      </h4>
                      <p className="text-sm text-muted-foreground">{drink.description}</p>
                      <p className="font-semibold text-rose-600">{drink.price}₽</p>
                      <Badge variant="outline">{drink.category}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateDrink(drink.id, { isNew: !drink.isNew })}
                      >
                        <Icon name="Star" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteDrink(drink.id)}
                      >
                        <Icon name="Trash" size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Добавить город</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Название города"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                  />
                  <Button onClick={addCity}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="font-semibold">Города присутствия</h3>
              {cities.map((city, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{city}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCity(city)}
                    >
                      <Icon name="Trash" size={14} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки сайта</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Название сайта</Label>
                  <Input
                    value={tempSettings.title}
                    onChange={(e) => setTempSettings({ ...tempSettings, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={tempSettings.description}
                    onChange={(e) => setTempSettings({ ...tempSettings, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Заголовок главной страницы</Label>
                  <Input
                    value={tempSettings.heroTitle}
                    onChange={(e) => setTempSettings({ ...tempSettings, heroTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Подзаголовок</Label>
                  <Textarea
                    value={tempSettings.heroSubtitle}
                    onChange={(e) => setTempSettings({ ...tempSettings, heroSubtitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Телефон</Label>
                  <Input
                    value={tempSettings.phone}
                    onChange={(e) => setTempSettings({ ...tempSettings, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={tempSettings.email}
                    onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Адрес</Label>
                  <Textarea
                    value={tempSettings.address}
                    onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                  />
                </div>
                <Button onClick={saveSettings} className="w-full">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить настройки
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление контентом</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Icon name="Image" size={24} className="mb-2" />
                    Изображения
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Icon name="FileText" size={24} className="mb-2" />
                    Тексты
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Icon name="Palette" size={24} className="mb-2" />
                    Цвета
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Icon name="Layout" size={24} className="mb-2" />
                    Макет
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Функции управления контентом будут доступны в следующих версиях.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}