import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  import 'package:flutter/material.dart';
  import 'package:firebase_core/firebase_core.dart';
  import 'package:provider/provider.dart';

  import 'widgets/theme.dart';
  import 'screens/splash_screen.dart';
  import 'screens/onboarding_screen.dart';
  import 'screens/login_screen.dart';
  import 'screens/home_screen.dart';
  import 'screens/cart_screen.dart';
  import 'screens/checkout_screen.dart';
  import 'screens/payment_screen.dart';
  import 'screens/orders_screen.dart';
  import 'screens/profile_screen.dart';
  import 'screens/admin_dashboard_screen.dart';

  void main() async {
    WidgetsFlutterBinding.ensureInitialized();
    await Firebase.initializeApp();
    runApp(const ChocoNutApp());
  }

  class ChocoNutApp extends StatelessWidget {
    const ChocoNutApp({super.key});

    @override
    Widget build(BuildContext context) {
      return ChangeNotifierProvider(
        create: (_) => AppTheme(),
        child: Consumer<AppTheme>(
          builder: (context, theme, _) {
            return MaterialApp(
              title: 'ChocoNut',
              debugShowCheckedModeBanner: false,
              theme: AppTheme.lightTheme,
              darkTheme: AppTheme.darkTheme,
              themeMode: theme.mode,
              initialRoute: '/splash',
              routes: {
                '/splash': (_) => const SplashScreen(),
                '/onboarding': (_) => const OnboardingScreen(),
                '/login': (_) => const LoginScreen(),
                '/home': (_) => const HomeScreen(),
                '/cart': (_) => const CartScreen(),
                '/checkout': (_) => const CheckoutScreen(),
                '/payment': (_) => const PaymentScreen(),
                '/orders': (_) => const OrdersScreen(),
                '/profile': (_) => const ProfileScreen(),
                '/admin': (_) => const AdminDashboardScreen(),
              },
            );
          },
        ),
      );
    }
  }
          //
