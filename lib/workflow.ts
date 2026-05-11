export type Depth = 'beginner' | 'practitioner';
export type DealType = 'apa' | 'spa' | 'merger';
export type ClauseProvenance = 'cuad' | 'hand-authored';

export interface DocumentItem {
  name: string;
  description?: string;
}

export interface ClauseRef {
  id: string;
  category: string;
  provenance: ClauseProvenance;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface Stage {
  id: string;
  index: number;
  title: string;
  kind: 'pre-process' | 'normal' | 'branch';
  description: { beginner: string; practitioner: string };
  documents: DocumentItem[];
  clauses: ClauseRef[];
  glossary: GlossaryTerm[];
  dealTypes: DealType[];
}

const cuad = (id: string, category: string): ClauseRef => ({
  id,
  category,
  provenance: 'cuad',
});

const gf = (id: string, category: string): ClauseRef => ({
  id,
  category,
  provenance: 'hand-authored',
});

export const STAGES: Stage[] = [
  {
    id: 'strategy',
    index: 1,
    title: 'Strategy',
    kind: 'pre-process',
    dealTypes: ['apa', 'spa', 'merger'],
    description: {
      beginner:
        'Before any deal exists, the buyer decides why it wants to acquire something and the seller decides why it wants to sell. No documents are signed with a counterparty yet — this stage is internal.',
      practitioner:
        'Buy-side: investment thesis, target screen, valuation range, financing plan, board approval to pursue. Sell-side: sale rationale, process design (auction vs. bilateral), banker engagement, vendor due diligence prep.',
    },
    documents: [
      { name: 'Internal investment memo / board deck' },
      { name: 'Engagement letter with financial advisor' },
      { name: 'Confidential Information Memorandum (CIM)', description: 'Sell-side marketing book.' },
      { name: 'Process letter', description: 'Sell-side, in an auction.' },
    ],
    clauses: [
      gf('gf-engagement-fee', 'Banker Fee Structure & Tail'),
      gf('gf-cim-disclaimer', 'CIM Legal Disclaimer & No-Reliance'),
    ],
    glossary: [
      { term: 'Buy-side / sell-side', definition: 'Which party the advisor represents.' },
      { term: 'CIM', definition: 'Confidential Information Memorandum, the sell-side marketing book.' },
      { term: 'Tail period', definition: "Window after engagement ends during which the banker still earns a fee if the client closes with an introduced buyer." },
    ],
  },
  {
    id: 'nda',
    index: 2,
    title: 'NDA',
    kind: 'normal',
    dealTypes: ['apa', 'spa', 'merger'],
    description: {
      beginner:
        'Before the seller shares sensitive information, both sides sign a Non-Disclosure Agreement promising not to leak it or use it for anything other than evaluating the deal.',
      practitioner:
        'One-way or mutual NDA. Key negotiation points: definition of confidential information, term, permitted uses, non-solicitation of employees, standstill (in public-target contexts), residuals carve-out, return/destruction obligations, governing law.',
    },
    documents: [{ name: 'Non-Disclosure Agreement (NDA)' }],
    clauses: [
      cuad('cuad-governing-law-nda', 'Governing Law'),
      cuad('cuad-no-solicit-employees-nda', 'No-Solicit Of Employees'),
      cuad('cuad-non-disparagement-nda', 'Non-Disparagement'),
      cuad('cuad-cap-liability-nda', 'Cap On Liability'),
      gf('gf-standstill', 'Standstill'),
      gf('gf-residuals', 'Residuals Carve-Out'),
    ],
    glossary: [
      { term: 'Standstill', definition: "Buyer agrees not to make unsolicited offers for the target's stock for a period." },
      { term: 'Residuals', definition: "Unaided memory of confidential info that an individual carries with them; a contested NDA term." },
    ],
  },
  {
    id: 'loi',
    index: 3,
    title: 'LOI / Term Sheet',
    kind: 'branch',
    dealTypes: ['apa', 'spa', 'merger'],
    description: {
      beginner:
        'The two sides write down the headline deal terms — price, structure, timeline, exclusivity — in a short document that is mostly non-binding. This is the first time the deal becomes "real". Structure is chosen here: asset (APA), stock (SPA), or merger.',
      practitioner:
        'Letter of intent sets price/range, consideration mix (cash/stock/earnout), structure, key conditions, exclusivity (no-shop), expense responsibility. Typically non-binding except for exclusivity, confidentiality, expenses, governing law, and termination. Structure choice drives the rest of the workflow.',
    },
    documents: [
      { name: 'Letter of Intent (LOI) / Term Sheet' },
      { name: 'Process bid letter', description: 'Auction context only.' },
    ],
    clauses: [
      cuad('cuad-exclusivity-loi', 'Exclusivity'),
      cuad('cuad-governing-law-loi', 'Governing Law'),
      gf('gf-binding-split', 'Binding vs. Non-Binding Split'),
      gf('gf-headline-price', 'Headline Price & Consideration Mix'),
      gf('gf-conditions-to-definitive', 'Conditions to Definitive Agreement'),
      gf('gf-expense-reimbursement', 'Expense Reimbursement'),
    ],
    glossary: [
      { term: 'No-shop / no-talk', definition: "Seller can't solicit other bidders (no-shop) and can't even respond to unsolicited approaches (no-talk)." },
      { term: 'Earnout', definition: 'Portion of purchase price contingent on post-closing performance.' },
      { term: 'APA / SPA / Merger', definition: 'Three structures: asset purchase, stock purchase, entity-level merger.' },
    ],
  },
  {
    id: 'dd',
    index: 4,
    title: 'Due Diligence',
    kind: 'normal',
    dealTypes: ['apa', 'spa', 'merger'],
    description: {
      beginner:
        "Buyer's lawyers, accountants, and specialists pore over the seller's documents to confirm the business is what the seller says it is, and to find risks that should change the price or the contract terms.",
      practitioner:
        'Workstreams: legal (corporate, contracts, litigation, IP, employment, regulatory, real estate, environmental), financial (Quality of Earnings), tax, commercial, technical/IT, HR, ESG. Output: DD reports with risk flags that flow into APA reps, indemnities, and closing conditions. DD is one node in v1; sub-streams are a v2 enhancement.',
    },
    documents: [
      { name: 'Data room index' },
      { name: 'Due diligence request list' },
      { name: 'DD reports (legal, financial, tax, commercial)' },
      { name: 'Quality of Earnings (QoE) report' },
      { name: 'Issues list / red-flag memo' },
      { name: 'Disclosure schedule drafts' },
    ],
    clauses: [
      cuad('cuad-change-of-control', 'Change Of Control'),
      cuad('cuad-anti-assignment', 'Anti-Assignment'),
      cuad('cuad-mfn', 'Most Favored Nation'),
      cuad('cuad-exclusivity-dd', 'Exclusivity'),
      cuad('cuad-non-compete-dd', 'Non-Compete'),
      cuad('cuad-termination-convenience', 'Termination For Convenience'),
      cuad('cuad-audit-rights', 'Audit Rights'),
      cuad('cuad-insurance', 'Insurance'),
      cuad('cuad-ip-ownership-assignment', 'IP Ownership Assignment'),
      cuad('cuad-license-grant', 'License Grant'),
    ],
    glossary: [
      { term: 'Data room', definition: "Secure online repository of the seller's documents." },
      { term: 'QoE', definition: 'Quality of Earnings, an accounting deep-dive on the target’s EBITDA.' },
      { term: 'Disclosure schedule', definition: "Exceptions list to the seller's reps and warranties." },
      { term: 'Anti-assignment', definition: 'Contract clause blocking transfer of the contract to a new owner — critical in an APA.' },
    ],
  },
  {
    id: 'apa-drafting',
    index: 5,
    title: 'APA Drafting & Negotiation',
    kind: 'normal',
    dealTypes: ['apa'],
    description: {
      beginner:
        'The lawyers write the long contract — the Asset Purchase Agreement — that says exactly which assets and liabilities transfer, for what price, and what happens if something goes wrong.',
      practitioner:
        "Buyer's counsel typically drafts first. The APA contains: definitions, purchase/sale of assets and assumed liabilities, purchase price + adjustments, closing mechanics, reps and warranties, pre-closing covenants, conditions to closing, termination, indemnification. Negotiation focuses on R&W scope, indemnity caps/baskets/survival, MAC definition, and purchase-price adjustment.",
    },
    documents: [
      { name: 'Asset Purchase Agreement (APA)' },
      { name: 'Disclosure schedules' },
      { name: 'Schedules of assumed/excluded assets and liabilities' },
      { name: 'Form ancillaries', description: 'Bill of sale, A&A, IP assignment, TSA, employment, non-compete.' },
    ],
    clauses: [
      cuad('cuad-governing-law-apa', 'Governing Law'),
      cuad('cuad-anti-assignment-apa', 'Anti-Assignment'),
      cuad('cuad-cap-liability-apa', 'Cap On Liability'),
      cuad('cuad-insurance-apa', 'Insurance'),
      cuad('cuad-ip-ownership-apa', 'IP Ownership Assignment'),
      cuad('cuad-license-grant-apa', 'License Grant'),
      cuad('cuad-non-compete-apa', 'Non-Compete'),
      cuad('cuad-no-solicit-apa', 'No-Solicit Of Employees'),
      gf('gf-purchased-assets', 'Purchased Assets / Excluded Assets'),
      gf('gf-assumed-liabilities', 'Assumed Liabilities / Excluded Liabilities'),
      gf('gf-purchase-price', 'Purchase Price & Adjustment'),
      gf('gf-earnout', 'Earnout'),
      gf('gf-escrow', 'Escrow / Holdback'),
      gf('gf-reps-seller', 'Representations & Warranties (Seller)'),
      gf('gf-reps-buyer', 'Representations & Warranties (Buyer)'),
      gf('gf-pre-closing-covenants', 'Pre-Closing Covenants'),
      gf('gf-conditions-to-closing', 'Conditions to Closing'),
      gf('gf-indemnification', 'Indemnification'),
      gf('gf-mac', 'Material Adverse Change (MAC)'),
      gf('gf-termination-fee', 'Termination & Termination Fee'),
      gf('gf-tax-matters', 'Tax Matters & §1060 Allocation'),
      gf('gf-employee-matters', 'Employee Matters'),
    ],
    glossary: [
      { term: 'Reps and warranties', definition: 'Statements of fact each side stands behind in the contract.' },
      { term: 'Basket / cap / survival', definition: 'The three knobs of indemnification scope: deductible, ceiling, and time limit.' },
      { term: 'MAC / MAE', definition: 'Material Adverse Change / Effect; closing condition shield against deterioration of the target.' },
      { term: 'Sandbagging', definition: "Whether buyer can sue on a known breach (pro-sandbag) or can't (anti-sandbag)." },
      { term: '§1060 allocation', definition: 'IRS-required allocation of purchase price across asset classes in an APA.' },
      { term: 'R&W insurance', definition: "Third-party policy covering breach of seller's representations." },
    ],
  },
  {
    id: 'signing',
    index: 6,
    title: 'Signing',
    kind: 'normal',
    dealTypes: ['apa', 'spa', 'merger'],
    description: {
      beginner:
        "Both sides sign the APA. In many deals, signing and closing are not the same day — there's a gap to get regulatory approvals and third-party consents.",
      practitioner:
        'Authority confirmed via board / member / shareholder resolutions. Signature pages exchanged, often via DocuSign with a release email. 8-K filed if buyer is U.S. public. Public announcement coordinated. Ancillaries are typically signed at closing, not signing, but attached as forms.',
    },
    documents: [
      { name: 'Executed APA + signature pages' },
      { name: 'Board / member / shareholder resolutions' },
      { name: 'Press release', description: 'If applicable.' },
      { name: 'Form 8-K', description: 'If buyer is U.S. public.' },
    ],
    clauses: [
      gf('gf-counterparts', 'Counterparts & Electronic Signature'),
      gf('gf-public-announcement', 'Public Announcement'),
    ],
    glossary: [
      { term: 'Signing vs. closing', definition: 'Execution date of the APA vs. the effective date when assets and money actually move.' },
      { term: 'Counterparts', definition: 'Separately signed pages that together form one agreement.' },
    ],
  },
  {
    id: 'pre-closing',
    index: 7,
    title: 'Pre-Closing',
    kind: 'normal',
    dealTypes: ['apa', 'spa', 'merger'],
    description: {
      beginner:
        'Between signing and closing, both sides have homework. The buyer files antitrust paperwork, the seller chases consents from key customers and lenders, and the seller has to keep running the business "normally" — no big changes.',
      practitioner:
        'HSR filing (if thresholds met) with 30-day waiting period; foreign merger filings; CFIUS where applicable. Third-party consents: landlords, key customers, lenders. Seller operates per ordinary-course covenant. Buyer arranges financing draw. Bring-down certificates prepared.',
    },
    documents: [
      { name: 'HSR filing (Hart-Scott-Rodino)' },
      { name: 'Foreign antitrust filings' },
      { name: 'Third-party consent letters' },
      { name: 'Estoppel certificates' },
      { name: 'Closing checklist' },
      { name: "Officer's bring-down certificate (draft)" },
    ],
    clauses: [
      cuad('cuad-anti-assignment-preclose', 'Anti-Assignment'),
      cuad('cuad-change-of-control-preclose', 'Change Of Control'),
      gf('gf-ordinary-course', 'Ordinary-Course Covenant'),
      gf('gf-regulatory-efforts', 'Regulatory Cooperation & Efforts Standard'),
      gf('gf-financing-covenant', 'Financing Covenant'),
    ],
    glossary: [
      { term: 'HSR', definition: 'Hart-Scott-Rodino premerger antitrust filing in the U.S.' },
      { term: 'CFIUS', definition: 'Committee on Foreign Investment in the U.S.; foreign-buyer national-security review.' },
      { term: 'Estoppel', definition: 'Counterparty confirmation of the current state of a contract.' },
      { term: 'Hell-or-high-water', definition: 'Strongest regulatory-efforts standard the buyer can be held to.' },
    ],
  },
  {
    id: 'closing',
    index: 8,
    title: 'Closing',
    kind: 'normal',
    dealTypes: ['apa', 'spa', 'merger'],
    description: {
      beginner:
        'The day the deal actually happens. Money moves, ownership of the assets transfers, and a stack of ancillary documents gets signed.',
      practitioner:
        'Mechanical execution of the APA: deliveries on each side per the closing checklist, funds flow per the funds-flow memo, title to assets passes via bill of sale and assignment instruments, IP transfers via IP assignments (recorded post-close), key employees onboard, parties exchange bring-down certificates.',
    },
    documents: [
      { name: 'Bill of Sale' },
      { name: 'Assignment & Assumption Agreement' },
      { name: 'IP Assignments', description: 'Patents, trademarks, copyrights, domains.' },
      { name: 'Real estate transfer documents' },
      { name: 'Transition Services Agreement (TSA)' },
      { name: 'Employment / consulting agreements' },
      { name: 'Non-compete / non-solicit with founders' },
      { name: 'Escrow Agreement' },
      { name: 'Funds Flow memo' },
      { name: "Officer's & Secretary's certificates" },
      { name: 'FIRPTA certificate' },
    ],
    clauses: [
      cuad('cuad-ip-assignment-closing', 'IP Ownership Assignment'),
      cuad('cuad-license-grant-closing', 'License Grant'),
      cuad('cuad-insurance-closing', 'Insurance'),
      gf('gf-tsa', 'Transition Services Agreement Scope'),
      gf('gf-escrow-release', 'Escrow Release Mechanics'),
      gf('gf-firpta', 'FIRPTA Certificate'),
    ],
    glossary: [
      { term: 'Bill of sale', definition: 'Conveys tangible personal property to the buyer.' },
      { term: 'A&A', definition: 'Assignment & Assumption Agreement; conveys contracts and the related liabilities.' },
      { term: 'TSA', definition: 'Transition Services Agreement; seller helps buyer run the business for a defined period after closing.' },
      { term: 'Funds flow', definition: 'Wire-by-wire schedule of money movement at closing.' },
      { term: 'FIRPTA', definition: 'Foreign Investment in Real Property Tax Act; certificate used to avoid U.S. withholding.' },
    ],
  },
  {
    id: 'post-closing',
    index: 9,
    title: 'Post-Closing',
    kind: 'normal',
    dealTypes: ['apa', 'spa', 'merger'],
    description: {
      beginner:
        "The deal isn't over at closing. There's a price true-up a few months later, an indemnification window where the buyer can claim back money for problems it discovers, and the messy work of integrating the acquired business.",
      practitioner:
        "Working-capital true-up: buyer's post-close statement, seller dispute window, accountant resolution, escrow release. Indemnification under R&W survival (general 12–24 months; fundamental reps longer; tax until SOL; fraud carve-out). Earnout measurement and disputes. Integration of systems, payroll, branding, customer comms. Post-closing covenants: non-compete, non-solicit, further-assurances, books and records access.",
    },
    documents: [
      { name: 'Post-closing working capital statement' },
      { name: 'Indemnification claim notices' },
      { name: 'Escrow release instructions' },
      { name: 'Earnout statements' },
      { name: 'Post-closing tax filings' },
      { name: 'Form 8594 (asset acquisition statement)' },
      { name: 'Integration plan' },
    ],
    clauses: [
      cuad('cuad-non-compete-post', 'Non-Compete'),
      cuad('cuad-no-solicit-customers-post', 'No-Solicit Of Customers'),
      cuad('cuad-audit-rights-post', 'Audit Rights'),
      cuad('cuad-cap-liability-post', 'Cap On Liability'),
      gf('gf-wc-adjustment', 'Working-Capital Adjustment Mechanics'),
      gf('gf-earnout-dispute', 'Earnout Dispute Resolution'),
      gf('gf-survival-schedule', 'Survival Schedule'),
      gf('gf-further-assurances', 'Further Assurances'),
      gf('gf-books-records-access', 'Books & Records Access'),
    ],
    glossary: [
      { term: 'True-up', definition: 'Post-closing adjustment to the purchase price, usually for working capital.' },
      { term: 'Survival', definition: 'How long after closing a rep can still be sued on.' },
      { term: 'Form 8594', definition: 'IRS asset-allocation form filed by both buyer and seller.' },
      { term: 'Further assurances', definition: 'Catch-all promise to sign whatever else turns out to be needed.' },
    ],
  },
];

export const STAGE_BY_ID: Record<string, Stage> = Object.fromEntries(
  STAGES.map((s) => [s.id, s])
);
