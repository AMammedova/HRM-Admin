import { OrganizationStructure } from '../types/structure.types';

export const mockOrganizationStructure: OrganizationStructure = {
  company: {
    id: '1',
    name: 'Grand-Mart MMC',
    description: 'Leading retail company',
  },
  employees: [
    { id: '1', name: 'Elçin Məmmədov', position: 'İcraçı direktor', departmentId: '1' },
    { id: '2', name: 'Aynur Həsənova', position: 'Layihə rəhbəri', departmentId: '2' },
    { id: '3', name: 'Rəşad Əliyev', position: 'Təhlükəsizlik şöbə müdiri', departmentId: '3' },
    { id: '4', name: 'Leyla Qurbanova', position: 'Kommersiya departament müdiri', departmentId: '4' },
    { id: '5', name: 'Fərid Məmmədov', position: 'Satış və kameralar müdiri', departmentId: '5' },
    { id: '6', name: 'Nigar İsmayılova', position: 'Megastore müdiri', departmentId: '6' },
    { id: '7', name: 'Tural Əhmədov', position: 'İT departament müdiri', departmentId: '7' },
    { id: '8', name: 'Səbinə Hacıyeva', position: 'Hüquq şöbə müdiri', departmentId: '8' },
    { id: '9', name: 'Kamran Nəsibov', position: 'Maliyyə departament müdiri', departmentId: '9' },
    { id: '10', name: 'Günel Bayramova', position: 'Təsərrüfat şöbə müdiri', departmentId: '10' },
    { id: '11', name: 'Elvin Cəfərov', position: 'Təlim və inkişaf şöbə müdiri', departmentId: '11' },
    { id: '12', name: 'Aysel Məmmədova', position: 'Şəmmüliyyət şöbə müdiri', departmentId: '12' },
    { id: '13', name: 'Ramin Əliyev', position: 'İnsan resursları departament müdiri', departmentId: '13' },
  ],
  departments: [
    {
      id: '1',
      name: 'Grand-Mart MMC',
      description: 'Baş şirkət',
      children: [
        {
          id: '2',
          name: 'Layihə rəhbəri',
          description: 'Layihələrin idarə edilməsi',
          parentDepartmentId: '1',
          children: [
            {
              id: '3',
              name: 'İcraçı direktor',
              description: 'Şirkət icraçı idarəetməsi',
              parentDepartmentId: '2',
              children: [
                {
                  id: '4',
                  name: 'Kommersiya departamenti',
                  description: 'Ticarət əməliyyatları',
                  parentDepartmentId: '3',
                },
                {
                  id: '5',
                  name: 'Satış və kameralar nəzarət şöbəsi',
                  description: 'Satış və təhlükəsizlik nəzarəti',
                  parentDepartmentId: '3',
                },
                {
                  id: '6',
                  name: 'Megastore, Grandmart...',
                  description: 'Mağaza idarəetməsi',
                  parentDepartmentId: '3',
                },
                {
                  id: '7',
                  name: 'İnformasiya texnologiyaları',
                  description: 'IT dəstək və inkişaf',
                  parentDepartmentId: '3',
                },
                {
                  id: '8',
                  name: 'Hüquq şöbəsi',
                  description: 'Hüquqi məsələlər',
                  parentDepartmentId: '3',
                },
                {
                  id: '9',
                  name: 'Maliyyə departamenti',
                  description: 'Maliyyə idarəetməsi',
                  parentDepartmentId: '3',
                  children: [
                    {
                      id: '10',
                      name: 'Təsərrüfat şöbəsi',
                      description: 'Xərc idarəetməsi',
                      parentDepartmentId: '9',
                    },
                    {
                      id: '11',
                      name: 'Təlim və inkişaf şöbəsi',
                      description: 'İşçilərin təlimi',
                      parentDepartmentId: '9',
                    },
                    {
                      id: '12',
                      name: 'Şəmmüliyyət şöbəsi',
                      description: 'Korporativ təşkilat',
                      parentDepartmentId: '9',
                    },
                  ],
                },
                {
                  id: '13',
                  name: 'İnsan resursları departamenti',
                  description: 'İşçilərin idarə edilməsi',
                  parentDepartmentId: '3',
                  children: [
                    {
                      id: '14',
                      name: 'İşə qəbul bölməsi',
                      description: 'Yeni işçilərin qəbulu',
                      parentDepartmentId: '13',
                    },
                    {
                      id: '15',
                      name: 'Nəzarət xidməti bölməsi',
                      description: 'Daxili audit',
                      parentDepartmentId: '13',
                    },
                    {
                      id: '16',
                      name: 'Nəzarət xidməti bölməsi',
                      description: 'Keyfiyyət nəzarəti',
                      parentDepartmentId: '13',
                    },
                    {
                      id: '17',
                      name: 'Nəzarət xidməti bölməsi',
                      description: 'Proseslərin nəzarəti',
                      parentDepartmentId: '13',
                    },
                    {
                      id: '18',
                      name: 'Nəzarət xidməti bölməsi',
                      description: 'Ümumi nəzarət',
                      parentDepartmentId: '13',
                    },
                  ],
                },
              ],
            },
            {
              id: '19',
              name: 'Təhlükəsizlik şöbəsi',
              description: 'Təhlükəsizlik və mühafizə',
              parentDepartmentId: '2',
              children: [
                {
                  id: '20',
                  name: 'Biznes proseslərin idarə edilməsi',
                  parentDepartmentId: '19',
                },
                {
                  id: '21',
                  name: 'Satəm şöbəsi',
                  parentDepartmentId: '19',
                },
                {
                  id: '22',
                  name: 'Daxili audit şöbəsi',
                  parentDepartmentId: '19',
                },
                {
                  id: '23',
                  name: 'Təmir audit',
                  parentDepartmentId: '19',
                },
                {
                  id: '24',
                  name: 'Keyfiyyətə nəzarət şöbəsi',
                  parentDepartmentId: '19',
                },
                {
                  id: '25',
                  name: 'Təhlükəsizlik şöbəsi',
                  parentDepartmentId: '19',
                  children: [
                    {
                      id: '26',
                      name: 'Tenderlərin keçirilməsi',
                      parentDepartmentId: '25',
                    },
                    {
                      id: '27',
                      name: 'Bolmart və ÖZİO Mart',
                      parentDepartmentId: '25',
                    },
                  ],
                },
              ],
            },
            {
              id: '28',
              name: 'Maliyyə departamenti',
              description: 'Əsas maliyyə departamenti',
              parentDepartmentId: '2',
              children: [
                {
                  id: '29',
                  name: 'Maliyyə və Uçot şöbəsi',
                  parentDepartmentId: '28',
                },
                {
                  id: '30',
                  name: 'Büdcə və Planlaşdırma',
                  parentDepartmentId: '28',
                },
                {
                  id: '31',
                  name: 'İnkasasiya şöbəsi',
                  parentDepartmentId: '28',
                },
                {
                  id: '32',
                  name: 'Mühasibatlıq və vergi',
                  parentDepartmentId: '28',
                },
                {
                  id: '33',
                  name: 'Büdcə və Planlaşdırma 2',
                  parentDepartmentId: '28',
                },
                {
                  id: '34',
                  name: 'Mühasibat və vergi 2',
                  parentDepartmentId: '28',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

