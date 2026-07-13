import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = ['Homemade Chocolates', 'Dry Fruits', 'Nuts', 'Gift Packs', 'Festival Specials'];
    final products = [
      _Product('Chocolate Truffle', 'Rich cocoa delight', '₹499', '₹399', '10% off'),
      _Product('Almond Crunch', 'Honey roasted almonds', '₹699', '₹549', '21% off'),
      _Product('Festival Mix', 'Assorted premium treats', '₹899', '₹749', '17% off'),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('ChocoNut'),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.search)),
          IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_none)),
          IconButton(onPressed: () => Navigator.pushNamed(context, '/cart'), icon: const Icon(Icons.shopping_cart_outlined)),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: const LinearGradient(colors: [Color(0xFF7B3F00), Color(0xFF4A2800)]),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Freshly Crafted', style: TextStyle(color: Colors.white70)),
                const SizedBox(height: 8),
                const Text('Premium chocolates & nuts for every mood', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                ElevatedButton(onPressed: () {}, child: const Text('Shop Now')),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text('Categories', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: categories.map((category) => Chip(label: Text(category), backgroundColor: const Color(0xFFF7E9D3))).toList(),
          ),
          const SizedBox(height: 20),
          const Text('Featured Products', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          ...products.map((product) => Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                child: ListTile(
                  leading: const CircleAvatar(radius: 28, backgroundColor: Color(0xFFF7E9D3), child: Icon(Icons.cake_outlined, color: Color(0xFF7B3F00))),
                  title: Text(product.name),
                  subtitle: Text('${product.description}\n${product.offer}'),
                  trailing: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Text(product.price, style: const TextStyle(fontWeight: FontWeight.bold)), Text(product.offerPrice)]),
                ),
              )),
        ],
      ),
      bottomNavigationBar: NavigationBar(destinations: const [
        NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.favorite_border), label: 'Wishlist'),
        NavigationDestination(icon: Icon(Icons.receipt_long), label: 'Orders'),
        NavigationDestination(icon: Icon(Icons.person_outline), label: 'Profile'),
      ], selectedIndex: 0, onDestinationSelected: (index) {
        switch (index) {
          case 1:
            Navigator.pushNamed(context, '/orders');
            break;
          case 2:
            Navigator.pushNamed(context, '/orders');
            break;
          case 3:
            Navigator.pushNamed(context, '/profile');
            break;
        }
      }),
    );
  }
}

class _Product {
  final String name;
  final String description;
  final String price;
  final String offerPrice;
  final String offer;

  _Product(this.name, this.description, this.price, this.offerPrice, this.offer);
}
