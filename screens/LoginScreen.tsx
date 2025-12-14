/**
 * LoginScreen - Enhanced authentication with validation
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowButton } from '@/components/GlowButton';
import { theme } from '@/theme';
import { apiService } from '@/services/api';

interface LoginScreenProps {
  onLogin: () => void;
  onSignup: () => void;
}

interface FieldError {
  email?: string;
  password?: string;
  general?: string;
}

interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const checkPasswordRequirements = (password: string): PasswordRequirements => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    
    const requirements = checkPasswordRequirements(password);
    const allMet = Object.values(requirements).every(req => req === true);
    
    if (!allMet) {
      const missing: string[] = [];
      if (!requirements.minLength) missing.push('8 characters');
      if (!requirements.hasUpperCase) missing.push('uppercase letter');
      if (!requirements.hasLowerCase) missing.push('lowercase letter');
      if (!requirements.hasNumber) missing.push('number');
      if (!requirements.hasSpecialChar) missing.push('special character');
      return `Password must include: ${missing.join(', ')}`;
    }
    
    return undefined;
  };

  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(text) }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (isSignup) {
      setPasswordRequirements(checkPasswordRequirements(text));
    }
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(text) }));
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const handleSubmit = async () => {
    setTouched({ email: true, password: true });
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const response = isSignup
        ? await apiService.signup(email, password)
        : await apiService.login(email, password);

      if (response.error) {
        // Check if it's a "user already exists" error
        if (response.error.toLowerCase().includes('already exists') || 
            response.error.toLowerCase().includes('user with this email')) {
          setErrors({ 
            general: response.error,
            email: 'An account with this email already exists. Try signing in instead.'
          });
          // Suggest switching to login
          setTimeout(() => {
            setIsSignup(false);
          }, 3000);
        } else {
          setErrors({ general: response.error });
        }
      } else {
        onLogin();
      }
    } catch (error) {
      setErrors({ 
        general: 'Failed to connect to server. Please make sure the backend is running on http://localhost:3000' 
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[theme.colors.background.primary, theme.colors.background.secondary, theme.colors.background.tertiary]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>AC</Text>
                </View>
              </View>
              <Text style={styles.title}>AI Closet</Text>
              <Text style={styles.subtitle}>
                {isSignup ? 'Create your account' : 'Welcome back'}
              </Text>
            </View>

            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.general}</Text>
                {errors.general.toLowerCase().includes('already exists') && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsSignup(false);
                      setErrors({});
                    }}
                    style={styles.switchToLoginButton}
                  >
                    <Text style={styles.switchToLoginText}>Switch to Sign In →</Text>
                  </TouchableOpacity>
                )}
                {errors.general.toLowerCase().includes('cannot connect') && (
                  <View style={styles.helpContainer}>
                    <Text style={styles.helpText}>
                      To start the backend server:{'\n'}
                      1. Open a terminal{'\n'}
                      2. Run: cd backend && npm run dev{'\n'}
                      3. Wait for "Server running on http://localhost:3000"
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.email && errors.email && styles.inputError,
                    touched.email && !errors.email && styles.inputSuccess,
                  ]}
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.text.tertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                {touched.email && errors.email && (
                  <Text style={styles.fieldError}>{errors.email}</Text>
                )}
                {touched.email && !errors.email && email && (
                  <Text style={styles.fieldSuccess}>✓ Valid email</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.password && errors.password && styles.inputError,
                    touched.password && !errors.password && password && styles.inputSuccess,
                  ]}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.text.tertiary}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!loading}
                />
                {touched.password && errors.password && (
                  <Text style={styles.fieldError}>{errors.password}</Text>
                )}
                {touched.password && !errors.password && password && (
                  <Text style={styles.fieldSuccess}>✓ Password meets all requirements</Text>
                )}
                {isSignup && password && (
                  <View style={styles.requirementsContainer}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <RequirementItem
                      met={passwordRequirements.minLength}
                      text="At least 8 characters"
                    />
                    <RequirementItem
                      met={passwordRequirements.hasUpperCase}
                      text="One uppercase letter (A-Z)"
                    />
                    <RequirementItem
                      met={passwordRequirements.hasLowerCase}
                      text="One lowercase letter (a-z)"
                    />
                    <RequirementItem
                      met={passwordRequirements.hasNumber}
                      text="One number (0-9)"
                    />
                    <RequirementItem
                      met={passwordRequirements.hasSpecialChar}
                      text="One special character (!@#$%...)"
                    />
                  </View>
                )}
              </View>

              <GlowButton
                title={loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
                onPress={handleSubmit}
                variant="primary"
                disabled={loading}
                style={styles.submitButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                onPress={() => {
                  setIsSignup(!isSignup);
                  setErrors({});
                  setTouched({ email: false, password: false });
                  setPasswordRequirements({
                    minLength: false,
                    hasUpperCase: false,
                    hasLowerCase: false,
                    hasNumber: false,
                    hasSpecialChar: false,
                  });
                }}
                style={styles.switchButton}
                disabled={loading}
              >
                <Text style={styles.switchText}>
                  {isSignup
                    ? 'Already have an account? ' : "Don't have an account? "}
                  <Text style={styles.switchTextBold}>
                    {isSignup ? 'Sign in' : 'Sign up'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.glow,
  },
  logoText: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background.primary,
  },
  title: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.status.error,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    fontSize: theme.typography.fontSize.base,
  },
  inputError: {
    borderColor: theme.colors.status.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  inputSuccess: {
    borderColor: theme.colors.status.success,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  fieldError: {
    color: theme.colors.status.error,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
  fieldSuccess: {
    color: theme.colors.status.success,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
  hint: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.secondary,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
  },
  switchButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  switchText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  switchTextBold: {
    color: theme.colors.accent.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  requirementsContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  requirementsTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  requirementText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginLeft: theme.spacing.sm,
  },
  requirementTextMet: {
    color: theme.colors.status.success,
  },
  requirementTextUnmet: {
    color: theme.colors.text.tertiary,
  },
  switchToLoginButton: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  switchToLoginText: {
    color: theme.colors.accent.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  helpContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: theme.borderRadius.sm,
  },
  helpText: {
    color: theme.colors.status.info,
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.fontSize.xs * 1.5,
  },
});

interface RequirementItemProps {
  met: boolean;
  text: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ met, text }) => (
  <View style={styles.requirementItem}>
    <Text style={[styles.requirementText, met ? styles.requirementTextMet : styles.requirementTextUnmet]}>
      {met ? '✓' : '○'} {text}
    </Text>
  </View>
);