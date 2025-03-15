import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createUsername } from '@/lib/client-api';
import { usernameFormSchema } from '@/lib/validation-schemas';
import type { UsernameFormDto } from '@/types/dtos';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UsernameDialog({ open, onClose }: Props) {
  const { data: session, update: updateSession } = useSession();

  const form = useForm<UsernameFormDto>({
    resolver: zodResolver(usernameFormSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createUsername,
    onSuccess: (user) => {
      updateSession({
        username: user.username,
      });

      onClose();
      form.setValue('username', '');
    },
    onError: (error: AxiosError) => {
      if (error.status === 409) {
        form.setError('username', { message: 'Username is already taken.' });
        return;
      }

      toast('Oops, something went wrong! Please try again later.');
    },
  });

  function saveChanges(values: UsernameFormDto) {
    mutate({ id: session!.user.id, data: values });
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader className="mb-2">
          <DialogTitle>Create a username</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveChanges)} className="space-y-7">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="johndoe" />
                  </FormControl>

                  <FormMessage className="absolute" />
                </FormItem>
              )}
            />

            <Button className="ml-auto flex" disabled={isPending}>
              {!isPending ? (
                'Save'
              ) : (
                <>
                  <Loader2 className="animate-spin" />
                  Saving
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
