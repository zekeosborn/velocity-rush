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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateUser } from '@/lib/client-api';
import { nameFormSchema } from '@/lib/validation-schemas';
import type { NameFormDto } from '@/types/dtos';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NameDialog({ open, onClose }: Props) {
  const { data: session, update: updateSession } = useSession();

  const form = useForm<NameFormDto>({
    resolver: zodResolver(nameFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      updateSession();
      onClose();
      form.setValue('name', '');
    },
    onError: () => {
      toast('Oops, something went wrong! Please try again later.');
    },
  });

  function saveChanges(values: NameFormDto) {
    mutate({ id: session!.user.id, data: values });
  }

  return (
    <Dialog open={open}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader className="mb-2">
          <DialogTitle>Enter your name</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveChanges)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>

                  <FormDescription>
                    This is your public display name.
                  </FormDescription>

                  <FormMessage />
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
