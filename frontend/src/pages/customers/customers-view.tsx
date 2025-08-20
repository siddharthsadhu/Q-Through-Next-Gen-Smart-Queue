import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/customers/customersSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const CustomersView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { customers } = useAppSelector((state) => state.customers)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View customers')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View customers')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/customers/customers-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Name</p>
                    <p>{customers?.name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>ContactInfo</p>
                    <p>{customers?.contact_info}</p>
                </div>

                <>
                    <p className={'block font-bold mb-2'}>Queue_entries Customer</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>JoinedAt</th>

                                <th>Status</th>

                            </tr>
                            </thead>
                            <tbody>
                            {customers.queue_entries_customer && Array.isArray(customers.queue_entries_customer) &&
                              customers.queue_entries_customer.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/queue_entries/queue_entries-view/?id=${item.id}`)}>

                                    <td data-label="joined_at">
                                        { dataFormatter.dateTimeFormatter(item.joined_at) }
                                    </td>

                                    <td data-label="status">
                                        { item.status }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!customers?.queue_entries_customer?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/customers/customers-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

CustomersView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default CustomersView;
