import 'package:flutter/material.dart';

class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Orders')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          ListTile(title: Text('Order #1001'), subtitle: Text('Pending - Confirmed'), trailing: Text('₹1,517')),
          ListTile(title: Text('Order #1002'), subtitle: Text('Packed - Shipped'), trailing: Text('₹799')),
          ListTile(title: Text('Order #1003'), subtitle: Text('Delivered'), trailing: Text('₹1,199')),
        ],
      ),
    );
  }
}
