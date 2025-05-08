import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmailInfoForm from './EmailInfoForm';
import SMTPProviderIcon from './SmtpProvidertIcon';

export default function CreateEmailAccount() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  return (
    // <ModalContent>
    <>
      <Card className="mt-4 max-w-[800px] bg-white shadow-sm border-none p-8">
        <p
          onClick={() => navigate('/email-accounts')}
          className="flex gap-px items-center text-gray-900 text-[13px] cursor-pointer underline"
        >
          <ChevronLeft className="size-4" />
          <span> Back</span>
        </p>
        <div className="mb-5 flex items-center gap-3">
          <SMTPProviderIcon className="size-8" />
          <CardHeader className="px-2">
            <CardTitle className="text-xs font-medium text-heading ">
              Connect With SMTP
            </CardTitle>
            <CardDescription className="text-sm font-medium text-heading">
              IMAP / SMTP
            </CardDescription>
          </CardHeader>
        </div>
        {/* Description */}
        {step === 0 && (
          <>
            <CardContent className="mt-6 p-0">
              <p className="text-xs text-paragraph">
                First, let&apos;s{' '}
                <span className="font-bold">
                  Enable 2-step verification & generate App password
                </span>
              </p>
              <ul className="mt-4 text-sm leading-7 text-paragraph">
                <li>
                  1. On Your Gmail {'>'} Manage Google Your Account {'>'}{' '}
                  Settings {'>'}{' '}
                  <span className="font-medium text-primary-700">Security</span>
                </li>
                <li>
                  2. Enable{' '}
                  <span className="font-medium text-primary-700">
                    2-Step Verification
                  </span>
                </li>
                <li>
                  3. Create An{' '}
                  <span className="font-medium text-primary-700">
                    App Password
                  </span>
                </li>
                <li>4. Save The App Password</li>
              </ul>
            </CardContent>
            <CardFooter className="mt-5 p-0">
              <Button
                onClick={() => setStep((prev) => prev + 1)}
                variant="primary"
                size="default"
                className="hover:bg-primary"
              >
                Yes! App has been created
              </Button>
            </CardFooter>
          </>
        )}

        {step === 1 && <EmailInfoForm />}
      </Card>
    </>
    // </ModalContent>
  );
}
