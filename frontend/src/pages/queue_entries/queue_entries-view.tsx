import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/queue_entries/queue_entriesSlice'
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

const Queue_entriesView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { queue_entries } = useAppSelector((state) => state.queue_entries)

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
              <title>{getPageTitle('View queue_entries')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View queue_entries')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/queue_entries/queue_entries-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Customer</p>

                        <p>{queue_entries?.customer?.name ?? 'No data'}</p>

                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Salon</p>

                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Service</p>

                        <p>{queue_entries?.service?.name ?? 'No data'}</p>

                </div>

                <FormField label='JoinedAt'>
                    {queue_entries.joined_at ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={queue_entries.joined_at ?
                        new Date(
                          dayjs(queue_entries.joined_at).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No JoinedAt</p>}
                </FormField>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Status</p>
                    <p>{queue_entries?.status ?? 'No data'}</p>
                </div>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/queue_entries/queue_entries-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

Queue_entriesView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default Queue_entriesView;
