import 'package:flutter/material.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cart')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Expanded(
              child: ListView(
                children: const [
                  ListTile(leading: CircleAvatar(child: Icon(Icons.cake)), title: Text('Chocolate Truffle'), subtitle: Text('Qty 2'), trailing: Text('₹798')),
                  ListTile(leading: CircleAvatar(child: Icon(Icons.emoji_nature)), title: Text('Almond Crunch'), subtitle: Text('Qty 1'), trailing: Text('₹549')),
                ],
              ),
            ),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Subtotal'), Text('₹1,347')]),
                    const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Delivery'), Text('₹50')]),
                    const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('GST'), Text('₹120')]),
                    const Divider(),
                    const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Grand Total', style: TextStyle(fontWeight: FontWeight.bold)), Text('₹1,517', style: TextStyle(fontWeight: FontWeight.bold))]),
                    const SizedBox(height: 12),
                    SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () => Navigator.pushNamed(context, '/checkout'), style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF7B3F00), foregroundColor: Colors.white), child: const Text('Checkout'))),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
