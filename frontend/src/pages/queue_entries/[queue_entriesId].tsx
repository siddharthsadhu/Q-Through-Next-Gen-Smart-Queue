import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

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
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/queue_entries/queue_entriesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditQueue_entries = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    customer: null,

    salon: null,

    service: null,

    joined_at: new Date(),

    status: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { queue_entries } = useAppSelector((state) => state.queue_entries)

  const { queue_entriesId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: queue_entriesId }))
  }, [queue_entriesId])

  useEffect(() => {
    if (typeof queue_entries === 'object') {
      setInitialValues(queue_entries)
    }
  }, [queue_entries])

  useEffect(() => {
      if (typeof queue_entries === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (queue_entries)[el])

          setInitialValues(newInitialVal);
      }
  }, [queue_entries])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: queue_entriesId, data }))
    await router.push('/queue_entries/queue_entries-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit queue_entries')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit queue_entries'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField label='Customer' labelFor='customer'>
        <Field
            name='customer'
            id='customer'
            component={SelectField}
            options={initialValues.customer}
            itemRef={'customers'}

            showField={'name'}

        ></Field>
    </FormField>

    <FormField label='Salon' labelFor='salon'>
        <Field
            name='salon'
            id='salon'
            component={SelectField}
            options={initialValues.salon}
            itemRef={'salons'}

        ></Field>
    </FormField>

    <FormField label='Service' labelFor='service'>
        <Field
            name='service'
            id='service'
            component={SelectField}
            options={initialValues.service}
            itemRef={'services'}

            showField={'name'}

        ></Field>
    </FormField>

      <FormField
          label="JoinedAt"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.joined_at ?
                  new Date(
                      dayjs(initialValues.joined_at).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'joined_at': date})}
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

EditQueue_entries.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditQueue_entries
