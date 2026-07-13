import 'package:flutter/material.dart';

class CheckoutScreen extends StatelessWidget {
  const CheckoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Delivery Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            const TextField(decoration: InputDecoration(labelText: 'Customer Name')),
            const SizedBox(height: 12),
            const TextField(decoration: InputDecoration(labelText: 'Phone Number')),
            const SizedBox(height: 12),
            const TextField(decoration: InputDecoration(labelText: 'Email')),
            const SizedBox(height: 12),
            const TextField(decoration: InputDecoration(labelText: 'Delivery Address')),
            const SizedBox(height: 20),
            const Text('Order Summary', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Coupon'), Text('WELCOME10')]),
            const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Delivery Charges'), Text('₹50')]),
            const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('GST'), Text('₹120')]),
            const Divider(),
            const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Final Amount', style: TextStyle(fontWeight: FontWeight.bold)), Text('₹1,517', style: TextStyle(fontWeight: FontWeight.bold))]),
            const SizedBox(height: 20),
            SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () => Navigator.pushNamed(context, '/payment'), style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF7B3F00), foregroundColor: Colors.white), child: const Text('Proceed to Payment'))),
          ],
        ),
      ),
    );
  }
}
