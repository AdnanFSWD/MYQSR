import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { MenuItemToolbar } from '../../components/menu/MenuItemToolbar';
import { MenuItemGrid } from '../../components/menu/MenuItemGrid';
import { MenuItemDialog } from '../../components/menu/MenuItemDialog';

interface MenuItemData {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  shortCode: string;
  description?: string | null;
  price: number;
  image: string;
  isAvailable: boolean;
  displayOrder: number;
}

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Burgers' },
  { id: 'cat-2', name: 'Sides' },
  { id: 'cat-3', name: 'Beverages' },
  { id: 'cat-4', name: 'Desserts' },
];

const INITIAL_MENU_ITEMS: MenuItemData[] = [
  { id: '1', categoryId: 'cat-1', categoryName: 'Burgers', name: 'Classic Cheeseburger', shortCode: 'CB01', description: 'Juicy beef patty with cheese and lettuce.', price: 8.99, image: 'burger.svg', isAvailable: true, displayOrder: 1 },
  { id: '2', categoryId: 'cat-2', categoryName: 'Sides', name: 'Crispy French Fries', shortCode: 'FF01', description: 'Salted golden potato fries.', price: 3.49, image: 'fries.svg', isAvailable: true, displayOrder: 2 },
  { id: '3', categoryId: 'cat-3', categoryName: 'Beverages', name: 'Vanilla Milkshake', shortCode: 'MS01', description: 'Creamy milk and vanilla blend.', price: 4.99, image: 'drink.svg', isAvailable: true, displayOrder: 3 },
  { id: '4', categoryId: 'cat-4', categoryName: 'Desserts', name: 'Choco Fudge Sundae', shortCode: 'SD01', description: 'Vanilla ice cream with chocolate drizzle.', price: 5.49, image: 'dessert.svg', isAvailable: false, displayOrder: 4 },
  { id: '5', categoryId: 'cat-1', categoryName: 'Burgers', name: 'Double Bacon Burger', shortCode: 'BB02', description: 'Double patty with crispy smoked bacon strips.', price: 11.99, image: 'burger.svg', isAvailable: true, displayOrder: 5 },
  { id: '6', categoryId: 'cat-2', categoryName: 'Sides', name: 'Onion Rings', shortCode: 'OR01', description: 'Crispy battered onion rings.', price: 4.29, image: 'fries.svg', isAvailable: true, displayOrder: 6 },
];

export const MenuItemsPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>(INITIAL_MENU_ITEMS);
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemData | null>(null);

  const categoryNames = useMemo(() => MOCK_CATEGORIES.map((c) => c.name), []);

  // Filter menu items dynamically
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Search Query Match
      const matchesSearch =
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.shortCode.toLowerCase().includes(searchValue.toLowerCase());

      // 2. Category Match
      const matchesCategory =
        categoryFilter === 'All' || item.categoryName === categoryFilter;

      // 3. Availability Match
      const matchesAvailability =
        availabilityFilter === 'All' ||
        (availabilityFilter === 'Available' && item.isAvailable) ||
        (availabilityFilter === 'Unavailable' && !item.isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [menuItems, searchValue, categoryFilter, availabilityFilter]);

  // Dialog actions
  const handleAddClick = () => {
    setSelectedMenuItem(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (item: MenuItemData) => {
    setSelectedMenuItem(item);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedMenuItem(null);
  };

  const handleSave = (data: Omit<MenuItemData, 'id'> & { id?: string }) => {
    const categoryName = MOCK_CATEGORIES.find((cat) => cat.id === data.categoryId)?.name || 'Unknown';

    if (data.id) {
      // Edit Mode
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? { ...item, ...data, categoryName }
            : item
        )
      );
    } else {
      // Add Mode
      const newItem: MenuItemData = {
        ...data,
        id: crypto.randomUUID(),
        categoryName,
      };
      setMenuItems((prev) => [...prev, newItem]);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Menu Item Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure menu offerings, prices, availability states, and item order.
        </Typography>
      </Box>

      {/* Toolbar Filters */}
      <MenuItemToolbar
        onAddClick={handleAddClick}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        availabilityFilter={availabilityFilter}
        onAvailabilityFilterChange={setAvailabilityFilter}
        categories={categoryNames}
      />

      {/* Menu Items Grid */}
      <MenuItemGrid
        rowData={filteredMenuItems}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onToggleAvailability={handleToggleAvailability}
      />

      {/* Add / Edit Dialog */}
      <MenuItemDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
        initialData={selectedMenuItem}
        categories={MOCK_CATEGORIES}
      />
    </Box>
  );
};
