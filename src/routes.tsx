import { Icon } from './lib/chakra';
import {
  MdFileCopy,
  MdHome,
  MdLock,
  MdLayers,
  MdAutoAwesome,
  MdChat,
  MdOutlineManageAccounts,
} from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { LuHistory } from 'react-icons/lu';
import { RoundedChart } from '@/components/icons/Icons';
import { IRoute } from './types/navigation';

const routes: IRoute[] = [
  {
    name: 'DPS - Drag & Drop',
    path: '/drag-drop',
    icon: <Icon as={MdAutoAwesome} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'GPT Helper',
    path: '/chatui/gpt',
    icon: <Icon as={MdChat} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'Grok Helper',
    path: '/chatui/grok',
    icon: <Icon as={MdChat} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'DPS - Dependency Helper',
    path: '/chatui/serveo',
    icon: <Icon as={MdChat} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'Gemini Helper',
    path: '/chatui/gemini',
    icon: <Icon as={MdChat} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'Sign In',
    path: '/signin',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'Sign Up',
    path: '/signup',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  // Disabled routes unchanged
  {
    name: 'All Templates',
    disabled: true,
    path: '/all-templates',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'My Projects',
    disabled: true,
    path: '/my-projects',
    icon: <Icon as={MdLayers} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'Other Pages',
    disabled: true,
    path: '/others',
    icon: <Icon as={MdFileCopy} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Prompt Page', layout: '/others', path: '/prompt' },
      { name: 'Register', layout: '/others', path: '/register' },
      { name: 'Sign In', layout: '/others', path: '/sign-in' },
    ],
  },
  {
    name: 'Admin Pages',
    disabled: true,
    path: '/admin',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'All Templates', layout: '/admin', path: '/all-admin-templates' },
      { name: 'New Template', layout: '/admin', path: '/new-template' },
      { name: 'Edit Template', layout: '/admin', path: '/edit-template' },
      { name: 'Users Overview', layout: '/admin', path: '/overview' },
    ],
  },
  {
    name: 'Profile Settings',
    disabled: true,
    path: '/settings',
    icon: (
      <Icon as={MdOutlineManageAccounts} width="20px" height="20px" color="inherit" />
    ),
    invisible: true,
    collapse: false,
  },
  {
    name: 'History',
    disabled: true,
    path: '/history',
    icon: <Icon as={LuHistory} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Usage',
    disabled: true,
    path: '/usage',
    icon: <Icon as={RoundedChart} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'My plan',
    disabled: true,
    path: '/my-plan',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Essay Generator',
    disabled: true,
    path: '/essay',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Content Simplifier',
    disabled: true,
    path: '/simplifier',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Product Description',
    disabled: true,
    path: '/product-description',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Email Enhancer',
    disabled: true,
    path: '/email-enhancer',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'LinkedIn Message',
    disabled: true,
    path: '/linkedin-message',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Instagram Caption',
    disabled: true,
    path: '/caption',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'FAQs Content',
    disabled: true,
    path: '/faq',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
];

export default routes;
