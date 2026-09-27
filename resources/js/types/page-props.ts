import { usePage } from '@inertiajs/react';
import { User } from '.';

export type PageProps = ReturnType<typeof usePage>['props'] & { auth: { user: User | null }; sidebar_state?: 'true' | 'false' };