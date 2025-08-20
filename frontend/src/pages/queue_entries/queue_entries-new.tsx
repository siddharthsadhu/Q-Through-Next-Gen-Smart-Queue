import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SwitchField } from '../../components/SwitchField'

import { SelectField } from '../../components/SelectField'
import {RichTextField} from "../../components/RichTextField";

import { create } from '../../stores/queue_entries/queue_entriesSlice'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'

const initialValues = {

    customer: '',

    salon: '',

    service: '',

    joined_at: '',

    status: 'waiting',

}

const Queue_entriesNew = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleSubmit = async (data) => {
    await dispatch(create(data))
    await router.push('/queue_entries/queue_entries-list')
  }
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Item" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={
                initialValues
            }
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

  <FormField label="Customer" labelFor="customer">
      <Field name="customer" id="customer" component={SelectField} options={[]} itemRef={'customers'}></Field>
  </FormField>

  <FormField label="Salon" labelFor="salon">
      <Field name="salon" id="salon" component={SelectField} options={[]} itemRef={'salons'}></Field>
  </FormField>

  <FormField label="Service" labelFor="service">
      <Field name="service" id="service" component={SelectField} options={[]} itemRef={'services'}></Field>
  </FormField>

  <FormField
      label="JoinedAt"
  >
      <Field
          type="datetime-local"
          name="joined_at"
          placeholder="JoinedAt"
      />
  </FormField>

  <FormField label="Status" labelFor="status">
      <Field name="status" id="status" component="select">

        <option value="waiting">waiting</option>

        <option value="served">served</option>

        <option value="cancelled">cancelled</option>

      </Field>
  </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/queue_entries/queue_entries-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

Queue_entriesNew.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default Queue_entriesNew
