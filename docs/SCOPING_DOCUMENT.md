## 1. Overview
**Problem**
Universal Store’s product catalogue only supports a rudimentary publishing system. Either a product is either live on the website or it is not (published or unpublished). This system works for basic publishing, but it does not provide staff with the controls to schedule products to go live on a certain date or time. Additionally, in its current form the product catalogue does not provide a clear audit history of what changed and when.

This creates two business problems:
- product launches and campaign changes rely on staff making manual updates at the exact time a product should go live.
- when something goes wrong, staff do not have a clear audit trail to understand what happened

This solution introduces two capabilities:
- the ability to schedule a product to go live automatically at a future date and time
- the ability to review a history of publication-related changes for auditing and troubleshooting

The goal of this version is to provide a simple, reliable publishing workflow that reduces manual effort, improves operational control, and makes product visibility changes easier to understand.

## 2. User capabilities

**Scheduled publishing**
Staff can:
- view products and easily understand whether they are already live, not yet live, or
  planned to go live later
- publish a product immediately when it should become visible right away
- schedule a product to go live automatically at a future date and time
- update or cancel a scheduled publish before it happens
- rely (trust) on the system to make the product visible at the intended time without manual intervention

Customers can:
- see only products that are currently meant to be visible in the catalogue

### Change history
Staff can:
- review a history of publication-related changes for an individual product
- see when a product was published, unpublished, scheduled, or had a scheduled
  publish cancelled
- use that history to audit changes and troubleshoot visibility issues
- review recent publishing activity across products

## 3. In scope
- a product catalogue view that only returns currently visible products
- an admin dashboard for managing product publication
- manual publish and unpublish actions
- scheduled publishing at a future date and time
- automatic publication once the scheduled time is reached
- publication history for audit and troubleshooting
- a local development setup suitable for demoing the system end to end

## 4. Out of scope

This version does not include:
- authentication and user management
- broader product editing such as title, price, imagery, or content management
- bulk actions across many products at once
- scheduled unpublishing
- downstream integrations with Shopify, NewStore, or warehouse systems
- deployment or production infrastructure
- a polished production-ready UI in the design system of Universal Store


## 5. Risks, assumptions, and unknowns

**Assumptions:**
- scheduling is based on a single consistent timezone approach
- only one active future publish is needed per product
- staff mainly need visibility control rather than full catalogue management

**Risks:**
- scheduled actions depend on background processing and need to run reliably
- time-based behaviour can be confusing if timezone expectations are unclear
- if the business later needs more complex workflows, the model may need to expand beyond simple publish scheduling

**Unknowns:**
- whether the business values scheduled unpublishing at the same level as scheduled publishing
- whether staff need bulk scheduling for large campaign launches (or linking to larger campaigns)
- how much user-level audit detail is required once authentication is in place

## 6. Production signals

The system will be considered successful if:
1. products become visible at the intended date and time without manual intervention
2. staff can trust that the scheduled change will occur
3. customers only see products that should currently be live
4. staff can clearly understand the current publication state of a product
5. staff can review a reliable history of publication-related changes
6. publishing issues are easier to troubleshoot because the system records what happened and when

## 7. Future Iterations

If this were extended beyond the minimal viable product, the next valuable additions would likely be:
- authentication and user attribution for audit records
- bulk scheduling and bulk publishing actions
- scheduled unpublishing
- stronger operational monitoring and alerting for failed scheduled actions
- integration with downstream systems to automatically trigger additional actions such as publishing of social campaigns