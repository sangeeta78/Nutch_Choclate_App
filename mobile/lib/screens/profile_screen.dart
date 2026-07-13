import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const ListTile(leading: CircleAvatar(child: Icon(Icons.person)), title: Text('Sangeeta Kumari'), subtitle: Text('sangeeta@example.com')),
          const Divider(),
          ListTile(leading: const Icon(Icons.edit), title: const Text('Edit Profile'), onTap: () {}),
          ListTile(leading: const Icon(Icons.location_on_outlined), title: const Text('Saved Addresses'), onTap: () {}),
          ListTile(leading: const Icon(Icons.favorite_border), title: const Text('Wishlist'), onTap: () {}),
          ListTile(leading: const Icon(Icons.help_outline), title: const Text('Help'), onTap: () {}),
          ListTile(leading: const Icon(Icons.privacy_tip_outlined), title: const Text('Privacy Policy'), onTap: () {}),
          ListTile(leading: const Icon(Icons.logout), title: const Text('Logout'), onTap: () => Navigator.pushReplacementNamed(context, '/login')),
        ],
      ),
    );
  }
}
