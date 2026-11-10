import type { RolePermissionsModalProps } from '../../types/permissions.types';
import BrandingSpecialistPermissionsModal from './BrandingSpecialistPermissionsModal';
import HiringManagerPermissionsModal from './HiringManagerPermissionsModal';
import AdminPermissionsModal from './AdminPermissionsModal';
import RecruiterPermissionsModal from './RecruiterPermissionsModal';
import RecruitmentManagerPermissionsModal from './RecruitmentManagerPermissionsModal';

export default function RolePermissionsModals(
  props: RolePermissionsModalProps,
) {
  switch (props.role.key) {
    case 'recruitment-manager':
      return <RecruitmentManagerPermissionsModal {...props} />;
    case 'recruiter':
      return <RecruiterPermissionsModal {...props} />;
    case 'branding-specialist':
      return <BrandingSpecialistPermissionsModal {...props} />;
    case 'admin':
      return <AdminPermissionsModal {...props} />;
    case 'hiring-manager':
      return <HiringManagerPermissionsModal {...props} />;
    default:
      return null;
  }
}
