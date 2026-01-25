'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';

type Step = 
  | 'mobile' 
  | 'altMobile' 
  | 'motherName' 
  | 'fatherName' 
  | 'altEmail' 
  | 'password';

const STEPS: Step[] = ['mobile', 'altMobile', 'motherName', 'fatherName', 'altEmail', 'password'];

export default function ActivationPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    alternateMobileNumber: '',
    motherName: '',
    fatherName: '',
    alternateEmail: '',
    password: '',
  });
  const [inputValue, setInputValue] = useState('');

  const currentStep = STEPS[currentStepIndex];

  const getStepConfig = (step: Step) => {
    switch (step) {
      case 'mobile':
        return {
          placeholder: 'ENTER YOUR 10-DIGIT MOBILE NUMBER',
          type: 'text',
          validation: (val: string) => /^\d{10}$/.test(val),
          errorMessage: 'Mobile number must be exactly 10 digits.',
          field: 'mobileNumber',
        };
      case 'altMobile':
        return {
          placeholder: 'ALTERNATE MOBILE (OPTIONAL)',
          type: 'text',
          validation: (val: string) => val === '' || /^\d{10}$/.test(val),
          errorMessage: 'Alternate mobile must be 10 digits if provided.',
          field: 'alternateMobileNumber',
        };
      case 'motherName':
        return {
          placeholder: "ENTER YOUR MOTHER'S NAME",
          type: 'text',
          validation: (val: string) => /^[a-zA-Z\s]+$/.test(val),
          errorMessage: "Please enter a valid name.",
          field: 'motherName',
        };
      case 'fatherName':
        return {
          placeholder: "ENTER YOUR FATHER'S NAME",
          type: 'text',
          validation: (val: string) => /^[a-zA-Z\s]+$/.test(val),
          errorMessage: "Please enter a valid name.",
          field: 'fatherName',
        };
      case 'altEmail':
        return {
          placeholder: 'ALTERNATE EMAIL (GMAIL ONLY)',
          type: 'email',
          validation: (val: string) => /^[^\s@]+@gmail\.com$/.test(val),
          errorMessage: 'Please enter a valid Gmail address. Temporary emails are not allowed.',
          field: 'alternateEmail',
        };
      case 'password':
        return {
          placeholder: 'CREATE A STRONG PASSWORD',
          type: 'password',
          validation: (val: string) => 
            val.length >= 8 &&
            /[a-zA-Z]/.test(val) &&
            /[0-9]/.test(val) &&
            /[^a-zA-Z0-9]/.test(val),
          errorMessage: 'Password must be 8+ characters with a letter, number, and special character.',
          field: 'password',
        };
      default:
        return { placeholder: '', type: 'text', validation: (val: string) => true, errorMessage: '', field: 'mobileNumber' as keyof typeof formData };
    }
  };

  const { placeholder, type, validation, errorMessage, field } = getStepConfig(currentStep);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (currentStep === 'motherName' || currentStep === 'fatherName') {
          value = value.toUpperCase();
      }
      setInputValue(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim() === '' && field === 'alternateMobileNumber') {
      // Allow empty optional field
    } else if (!validation(inputValue)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: errorMessage,
      });
      return;
    }
    
    const newFormData = { ...formData, [field]: inputValue };
    setFormData(newFormData);

    if (currentStepIndex === STEPS.length - 1) {
      console.log('Final Activation Data:', newFormData);
      toast({
        title: 'Activation Complete!',
        description: 'Your account details have been saved.',
      });
      router.push('/dashboard');
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
      setInputValue(''); 
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden flex items-center justify-center">
      <video
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 container flex justify-start">
        <div className="w-full max-w-md">
           <form className="group flex items-center gap-4 rounded-full border-2 border-white/20 bg-black/30 p-2 backdrop-blur-sm transition-all focus-within:border-white/50 focus-within:bg-black/50" onSubmit={handleSubmit}>
              <Input
                type={type}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                className="h-12 flex-1 rounded-full border-none bg-transparent px-6 text-lg text-white placeholder:text-white/50 focus:ring-0"
              />
              <Button
                type="submit"
                size="icon"
                className="h-12 w-12 flex-shrink-0 rounded-full bg-white/10 text-white transition-all group-hover:bg-white/20"
              >
                <span className="sr-only">Next</span>
                <ArrowRight className="h-6 w-6" />
              </Button>
            </form>
        </div>
      </div>
    </div>
  );
}
