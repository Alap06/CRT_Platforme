import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cin: '',
    governorate: '',
    city: '',
    postalCode: '',
    userType: 'benevole',
    status: 'pending',
    acceptTerms: false, // Ajout du champ manquant
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState(null);

  const { register, isAuthenticated, error, clearErrors, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/Login');
    }
    return () => clearErrors(); // Clear errors on unmount
  }, [isAuthenticated, navigate, clearErrors, loading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError(null); // Clear submission error on input change
  };

  const validateStep1 = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^[0-9]{8}$/.test(formData.phone)) {
      errors.phone = 'Format de téléphone invalide (8 chiffres)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
      errors.password = 'Doit contenir une majuscule, un chiffre et un caractère spécial';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.cin.trim()) {
      errors.cin = 'Le numéro CIN est requis';
    } else if (!/^[0-9]{8}$/.test(formData.cin)) {
      errors.cin = 'Format CIN invalide (8 chiffres)';
    }

    if (!formData.governorate.trim()) {
      errors.governorate = 'Le gouvernorat est requis';
    }

    if (!formData.city.trim()) {
      errors.city = 'La ville est requise';
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Le code postal est requis';
    } else if (!/^[0-9]{4}$/.test(formData.postalCode)) {
      errors.postalCode = 'Format de code postal invalide (4 chiffres)';
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Vous devez accepter les conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateStep2()) {
      setIsSubmitting(true);
      setSubmitError(null);

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        cin: formData.cin,
        governorate: formData.governorate,
        city: formData.city,
        postalCode: formData.postalCode,
        userType: formData.userType,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // Ajout du champ confirmPassword
        status: 'pending',
      };

      try {
        await register(userData);
        // La redirection est maintenant gérée dans AuthContext.jsx
      } catch (err) {
        setSubmitError(err.response?.data?.message || "Échec de l'inscription");
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-16 w-auto"
          src="../images/logo-croissant-rouge.png"
          alt="Logo Croissant Rouge"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {currentStep === 1 ? 'Informations personnelles' : 'Création de compte'}
        </h2>

        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              1
            </div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              2
            </div>
          </div>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Déjà membre ?{' '}
          <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
            Connectez-vous ici
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(error || submitError) && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error || submitError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {currentStep === 1 ? (
              <>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleChange}
                        aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      />
                      {formErrors.firstName && (
                        <p id="firstName-error" className="mt-1 text-sm text-red-600">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleChange}
                        aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          formErrors.lastName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      />
                      {formErrors.lastName && (
                        <p id="lastName-error" className="mt-1 text-sm text-red-600">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Adresse email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-describedby={formErrors.email ? 'email-error' : undefined}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {formErrors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {formErrors.phone && (
                      <p id="phone-error" className="mt-1 text-sm text-red-600">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                    Je souhaite m'inscrire en tant que
                  </label>
                  <div className="mt-1">
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    >
                      <option value="benevole">Bénévole</option>
                      <option value="donateur">Donateur</option>
                      <option value="partenaire">Partenaire</option>
                    </select>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Suivant
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      aria-describedby={formErrors.password ? 'password-error' : 'password-help'}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {formErrors.password ? (
                      <p id="password-error" className="mt-1 text-sm text-red-600">
                        {formErrors.password}
                      </p>
                    ) : (
                      <p id="password-help" className="mt-1 text-xs text-gray-500">
                        Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, un
                        chiffre et un caractère spécial.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      aria-describedby={formErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {formErrors.confirmPassword && (
                      <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="cin" className="block text-sm font-medium text-gray-700">
                    Numéro CIN
                  </label>
                  <div className="mt-1">
                    <input
                      id="cin"
                      name="cin"
                      type="text"
                      value={formData.cin}
                      onChange={handleChange}
                      aria-describedby={formErrors.cin ? 'cin-error' : undefined}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        formErrors.cin ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                    {formErrors.cin && (
                      <p id="cin-error" className="mt-1 text-sm text-red-600">{formErrors.cin}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="governorate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gouvernorat
                    </label>
                    <div className="mt-1">
                      <input
                        id="governorate"
                        name="governorate"
                        type="text"
                        value={formData.governorate}
                        onChange={handleChange}
                        aria-describedby={formErrors.governorate ? 'governorate-error' : undefined}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          formErrors.governorate ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      />
                      {formErrors.governorate && (
                        <p id="governorate-error" className="mt-1 text-sm text-red-600">
                          {formErrors.governorate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Ville
                    </label>
                    <div className="mt-1">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        aria-describedby={formErrors.city ? 'city-error' : undefined}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          formErrors.city ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      />
                      {formErrors.city && (
                        <p id="city-error" className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Code postal
                    </label>
                    <div className="mt-1">
                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleChange}
                        aria-describedby={formErrors.postalCode ? 'postalCode-error' : undefined}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          formErrors.postalCode ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      />
                      {formErrors.postalCode && (
                        <p id="postalCode-error" className="mt-1 text-sm text-red-600">
                          {formErrors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      aria-describedby={formErrors.acceptTerms ? 'acceptTerms-error' : undefined}
                      className={`focus:ring-red-500 h-4 w-4 ${
                        formErrors.acceptTerms ? 'text-red-600 border-red-300' : 'text-red-600 border-gray-300'
                      } rounded`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                      J'accepte les{' '}
                      <Link to="/terms" className="text-red-600 hover:text-red-500">
                        conditions d'utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link to="/privacy" className="text-red-600 hover:text-red-500">
                        politique de confidentialité
                      </Link>
                    </label>
                    {formErrors.acceptTerms && (
                      <p id="acceptTerms-error" className="mt-1 text-sm text-red-600">
                        {formErrors.acceptTerms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Précédent
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;