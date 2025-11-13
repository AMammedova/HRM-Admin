import { PageHeader } from '@/shared/organisms/PageHeader';
import { StructureContainer } from '@/features/structure/containers/StructureContainer';


export default async function StructurePage() {


  return (
    <div className="space-y-6">
      <PageHeader 
        title="Struktur" 
        description="Təşkilat strukturu və iyerarxiyası" 
      />
      <StructureContainer />
    </div>
  );
}

