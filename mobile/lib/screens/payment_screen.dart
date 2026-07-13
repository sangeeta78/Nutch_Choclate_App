import 'package:flutter/material.dart';

class PaymentScreen extends StatelessWidget {
  const PaymentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Select Payment Method', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            const Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                Chip(label: Text('UPI')),
                Chip(label: Text('Net Banking')),
                Chip(label: Text('Debit Card')),
                Chip(label: Text('Credit Card')),
                Chip(label: Text('Wallet')),
                Chip(label: Text('Cash on Delivery')),
              ],
            ),
            const SizedBox(height: 20),
            const Text('Dummy Payment Gateway', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Processing your payment securely. No real gateway is connected.'),
            const SizedBox(height: 20),
            SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () async {
              showDialog(context: context, builder: (_) => const Center(child: CircularProgressIndicator()));
              await Future.delayed(const Duration(seconds: 3));
              if (!context.mounted) return;
              Navigator.pop(context);
              Navigator.pushReplacementNamed(context, '/orders');
            }, style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF7B3F00), foregroundColor: Colors.white), child: const Text('Pay Now'))),
          ],
        ),
      ),
    );
  }
}
