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
import { updateUser } from '@/lib/client-api';
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
  isOpen: boolean;
  onClose: () => void;
}

export default function UsernameDialog({ isOpen, onClose }: Props) {
  const { data: session, update: updateSession } = useSession();

  const form = useForm<UsernameFormDto>({
    resolver: zodResolver(usernameFormSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      updateSession({ username: user.username });
      onClose();
      form.reset();
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        form.setError('username', { message: 'Username is already taken.' });
      } else {
        toast('Oops, something went wrong! Please try again later.');
      }
    },
  });

  function saveChanges(values: UsernameFormDto) {
    if (!session?.user.id) return;
    mutate({ id: session.user.id, data: values });
  }

  return (
    <Dialog open={isOpen}>
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
                    <Input
                      {...field}
                      placeholder="johndoe"
                      autoComplete="off"
                    />
                  </FormControl>

                  <FormMessage className="absolute" />
                </FormItem>
              )}
            />

            <Button className="ml-auto flex" disabled={isPending}>
              {!isPending ? (
                'Create'
              ) : (
                <>
                  <Loader2 className="animate-spin" />
                  Creating
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
